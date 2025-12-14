import { PrismaClient, UserRole, UserStatus, DocType, DocStatus, AuditAction } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
    console.log('Start seeding ...');

    // CLEANUP
    try {
        await prisma.auditLog.deleteMany();
        await prisma.document.deleteMany();
        await prisma.fund.deleteMany();
        await prisma.user.deleteMany();
    } catch (e) {
        console.log("Cleanup skipped or partial");
    }

    const password = await bcrypt.hash('password123', 10);

    // USERS
    const admin = await prisma.user.create({
        data: { email: 'admin@auditvault.com', name: 'System Admin', password, role: UserRole.ADMIN, status: UserStatus.ACTIVE },
    });

    const auditor = await prisma.user.create({
        data: { email: 'auditor@auditvault.com', name: 'Alice Auditor', password, role: UserRole.AUDITOR, status: UserStatus.ACTIVE },
    });

    const manager1 = await prisma.user.create({
        data: { email: 'manager@funds.com', name: 'Bob Manager', password, role: UserRole.FUND_MANAGER, status: UserStatus.ACTIVE },
    });

    const compliance = await prisma.user.create({
        data: { email: 'compliance@auditvault.com', name: 'Sarah Compliance', password, role: UserRole.COMPLIANCE_OFFICER, status: UserStatus.ACTIVE },
    });

    const pendingUser = await prisma.user.create({
        data: { email: 'newguy@test.com', name: 'New Guy (Pending)', password, role: UserRole.AUDITOR, status: UserStatus.PENDING },
    });

    console.log('Created users');
    console.log('Admin: admin@auditvault.com / password123');
    console.log('Manager: manager@funds.com / password123');
    console.log('Auditor: auditor@auditvault.com / password123');

    // FUNDS
    const fundsData = [
        { code: 'GF-001', name: 'Global Tech Fund', region: 'North America', currency: 'USD' },
        { code: 'GF-002', name: 'European Growth Fund', region: 'Europe', currency: 'EUR' },
        { code: 'GF-003', name: 'Asian Opportunities', region: 'Asia Pacific', currency: 'SGD' },
        { code: 'GF-004', name: 'Green Energy ETF', region: 'Global', currency: 'USD' },
        { code: 'GF-005', name: 'Crypto Index Fund', region: 'Global', currency: 'USD' },
        { code: 'RE-101', name: 'Real Estate Prime', region: 'North America', currency: 'USD' },
    ];

    const funds = [];
    for (const f of fundsData) {
        funds.push(await prisma.fund.create({ data: { ...f, managers: { connect: [{ id: manager1.id }] } } }));
    }

    console.log('Created funds');

    // DOCUMENTS
    const docTypes = Object.values(DocType);
    const docStatuses = Object.values(DocStatus);

    for (let i = 0; i < 50; i++) {
        const fund = funds[Math.floor(Math.random() * funds.length)];
        const uploader = [admin, manager1, compliance][Math.floor(Math.random() * 3)];
        const type = docTypes[Math.floor(Math.random() * docTypes.length)];
        const status = docStatuses[Math.floor(Math.random() * docStatuses.length)];

        // Random dates within last year
        const date = new Date();
        date.setDate(date.getDate() - Math.floor(Math.random() * 60)); // Recent docs

        const doc = await prisma.document.create({
            data: {
                title: `${type.toString().replace(/_/g, ' ')} - ${fund.code}`,
                fundId: fund.id,
                type,
                status,
                periodStart: new Date(2024, 0, 1),
                periodEnd: new Date(2024, 11, 31),
                fileKey: `dummy-key-${i}`,
                uploadedById: uploader.id,
                createdAt: date,
            }
        });

        // Create Audit Log for creation
        await prisma.auditLog.create({
            data: {
                documentId: doc.id,
                userId: uploader.id,
                action: AuditAction.CREATED,
                timestamp: date,
                details: { fileKey: doc.fileKey }
            }
        });

        // If status changed, add another log
        if (status !== DocStatus.PENDING) {
            await prisma.auditLog.create({
                data: {
                    documentId: doc.id,
                    userId: auditor.id,
                    action: AuditAction.STATUS_CHANGED,
                    timestamp: new Date(date.getTime() + 1000 * 60 * 60 * (Math.random() * 24)),
                    details: { oldStatus: 'PENDING', newStatus: status }
                }
            });
        }
    }

    console.log('Created documents and logs');
    console.log('Seeding finished.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
