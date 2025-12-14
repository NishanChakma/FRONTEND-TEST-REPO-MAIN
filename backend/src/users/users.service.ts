import { Injectable, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
    constructor(private prisma: PrismaService) { }

    async create(createUserDto: CreateUserDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { email: createUserDto.email },
        });

        if (existingUser) {
            throw new ConflictException('User with this email already exists');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                ...createUserDto,
                password: hashedPassword,
            },
        });

        const { password, ...result } = user;
        return result;
    }

    async findOne(email: string) {
        return this.prisma.user.findUnique({
            where: { email },
        });
    }

    async findById(id: string) {
        const user = await this.prisma.user.findUnique({
            where: { id }
        });
        if (user) {
            const { password, ...result } = user;
            return result;
        }
        return null;
    }
    async findAll(status?: string) {
        const where: any = {};
        if (status) {
            where.status = status;
        }
        const users = await this.prisma.user.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
        return users.map(user => {
            const { password, ...result } = user;
            return result;
        });
    }

    async updateStatus(id: string, status: any) {
        const user = await this.prisma.user.update({
            where: { id },
            data: { status },
        });
        const { password, ...result } = user;
        return result;
    }
}
