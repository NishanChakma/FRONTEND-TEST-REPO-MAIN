import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditAction } from '@prisma/client';

@Injectable()
export class AuditService {
    constructor(private prisma: PrismaService) { }

    async logAction(userId: string, documentId: string, action: AuditAction, details?: any) {
        await this.prisma.auditLog.create({
            data: {
                userId,
                documentId,
                action,
                details: details ?? {},
            },
        });
    }

    async getHistory(documentId: string) {
        return this.prisma.auditLog.findMany({
            where: { documentId },
            include: { user: { select: { name: true, role: true } } },
            orderBy: { timestamp: 'desc' },
        });
    }
}
