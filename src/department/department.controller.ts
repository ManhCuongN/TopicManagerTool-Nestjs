import { Body, Controller, Get, Inject, Next, Param, Patch, Post, Req, Res, UseGuards } from '@nestjs/common';
import { DepartmentService } from './department.service';
import { RolesGuard } from 'src/guards/google.guard';
import { Roles } from 'src/guards/role.decorator';
import { Role } from 'src/constant/roleCode';
import { CreateDepartmentDto } from 'src/dtos/create-department.dto';
import { HTTP_CREATED_STATUS } from 'src/constant/httpCode';
import { NextFunction } from 'express';

@Controller('department')
export class DepartmentController {

    constructor(
        @Inject(DepartmentService) private departmentService: DepartmentService
    ) {}

    @Post('/create')
    @UseGuards(RolesGuard)
    @Roles(Role.STUDENT)
    async createDepartment(@Body() createDep: CreateDepartmentDto, @Req() req, @Res() res) {
        try {
            const currentUser = req.user
            await this.departmentService.create(createDep,currentUser)
            res.status(HTTP_CREATED_STATUS).json()
        } catch (error) {
            res.status(500).json(error)
        }
    }

    @Patch('update/:id')
    @UseGuards(RolesGuard)
    @Roles(Role.STUDENT) 
    async updateDepartment(@Param('id') id: string, @Body() body, @Req() req, @Res() res, @Next() next: NextFunction) {
        try {
            const currentUser = req.user
            await this.departmentService.update(id,body,currentUser)
            res.status(200).json({message: "Update Department Successfully"})
        } catch (error) {
            next(error)
        }
    }

    @Get('test')
    @UseGuards(RolesGuard)
    @Roles(Role.STUDENT)
    async tese(@Req() req) {
      console.log(req.user.role);
    }
}
