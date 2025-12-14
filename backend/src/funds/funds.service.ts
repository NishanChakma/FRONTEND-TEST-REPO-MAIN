import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFundDto } from './dto/create-fund.dto';
import { UpdateFundDto } from './dto/update-fund.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class FundsService {
    constructor(private prisma: PrismaService) { }

    async create(createFundDto: CreateFundDto) {
        return this.prisma.fund.create({
            data: createFundDto,
        });
    }

    async findAll(user: { id: string; role: UserRole }) {
        if (user.role === UserRole.FUND_MANAGER) {
            return this.prisma.fund.findMany({
                where: {
                    managers: {
                        some: {
                            id: user.id,
                        },
                    },
                },
            });
        }
        return this.prisma.fund.findMany();
    }

    async findOne(id: string) {
        const fund = await this.prisma.fund.findUnique({
            where: { id },
        });
        if (!fund) {
            throw new NotFoundException(`Fund with ID ${id} not found`);
        }
        return fund;
    }

    async update(id: string, updateFundDto: UpdateFundDto) {
        return this.prisma.fund.update({
            where: { id },
            data: updateFundDto,
        });
    }
}
