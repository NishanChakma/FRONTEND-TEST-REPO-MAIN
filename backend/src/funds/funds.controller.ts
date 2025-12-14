import { Controller, Get, Post, Body, Patch, Param, Req, UseGuards, ForbiddenException } from '@nestjs/common';
import { FundsService } from './funds.service';
import { CreateFundDto } from './dto/create-fund.dto';
import { UpdateFundDto } from './dto/update-fund.dto';
import { AuthGuard } from '@nestjs/passport';
import { UserRole } from '@prisma/client';

@UseGuards(AuthGuard('jwt'))
@Controller('funds')
export class FundsController {
    constructor(private readonly fundsService: FundsService) { }

    @Post()
    create(@Body() createFundDto: CreateFundDto, @Req() req: any) {
        if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.COMPLIANCE_OFFICER) {
            throw new ForbiddenException('Only Admin or Compliance Officer can create funds');
        }
        return this.fundsService.create(createFundDto);
    }

    @Get()
    findAll(@Req() req: any) {
        return this.fundsService.findAll(req.user);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.fundsService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateFundDto: UpdateFundDto, @Req() req: any) {
        if (req.user.role !== UserRole.ADMIN && req.user.role !== UserRole.COMPLIANCE_OFFICER) {
            throw new ForbiddenException('Only Admin or Compliance Officer can update funds');
        }
        return this.fundsService.update(id, updateFundDto);
    }
}
