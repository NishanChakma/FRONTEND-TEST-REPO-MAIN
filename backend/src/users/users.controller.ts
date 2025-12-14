import { Controller, Post, Body, Get, ParseUUIDPipe, Param, UseGuards, Query, Patch } from '@nestjs/common';
import { UserStatus } from '@prisma/client';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }

    @Post()
    create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOne(@Param('id', ParseUUIDPipe) id: string) {
        return this.usersService.findById(id);
    }

    @UseGuards(AuthGuard('jwt'))  
    @Get()
    async findAll(@Query('status') status?: string) {
        return this.usersService.findAll(status);
    }

    @UseGuards(AuthGuard('jwt'))  
    @Patch(':id/status')
    async updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @Body('status') status: UserStatus,
    ) {
        return this.usersService.updateStatus(id, status);
    }
}
