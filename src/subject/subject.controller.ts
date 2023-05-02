import { Body, Controller, Get, HttpStatus, Inject, Next, Param, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { Roles } from 'src/guards/role.decorator';
import { Role } from 'src/constant/roleCode';
import { RolesGuard } from 'src/guards/google.guard';
import { CreateSubjectDto } from 'src/dtos/create-subject.dto';
import { HTTP_CREATED_STATUS } from 'src/constant/httpCode';
import { UpdateSubjectDto } from 'src/dtos/update-subject.dto';
import { CreateSchelude } from 'src/dtos/create-schedule.dto';
import { NextFunction } from 'express';

@Controller('subject')
export class SubjectController {

    constructor(@Inject(SubjectService) private subjectService: SubjectService) {}

    @Post('/create')
    @UsePipes(new ValidationPipe())
    @UseGuards(RolesGuard)
    @Roles(Role.ROLE_MANAGER)
    async createSubject(@Body() createSubject: CreateSubjectDto, @Req() req, @Res() res) {
         try {
            const currentUser = req.user
            const result = await this.subjectService.create(createSubject,currentUser)
           return res.status(HTTP_CREATED_STATUS).json({message:"Created Subject Successfully"})
            
         } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' })
         }
        
    }

    @Put('/update/:id')
    @UsePipes(new ValidationPipe())
    @UseGuards(RolesGuard)
    @Roles(Role.ROLE_TEACHER)
    async updateSubject(@Body()updateSubject: UpdateSubjectDto,@Param('id') id: number, @Req() req, @Res() res) {
         try {
            const currentUser = req.user
            const result = await this.subjectService.update(id, updateSubject,currentUser)
            return res.status(200).json({message:"Updated Subject Successfully"})
            
         } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' })
         }
        
    }

    @Get('/get/genaral/info/:id')
    @UseGuards(RolesGuard)
    @Roles(Role.ROLE_MANAGER)
    async getGenaralInfo(@Param('id') id: number, @Req() req, @Res() res) {
         try {   
            const result =  await this.subjectService.getGenaralInfo(id)
            return res.status(200).json({data: result})         
         } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' })
         }
        
    }

    @Post('/create/schedule/:id')
    @UseGuards(RolesGuard)
    @UsePipes(new ValidationPipe())
    @Roles(Role.ROLE_MANAGER)
    async createSchelude(@Param('id') id: number,@Body() createSchBody: CreateSchelude, @Req() req, @Res() res) {
         try {   
            const currentUser = req.user
            await this.subjectService.createSchelude(id, createSchBody, currentUser)
            return res.status(200).json({message: "Create Schedule Successfully"})         
         } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' })
         }
        
    }

    @Post('/add/students/:id')
    @UseGuards(RolesGuard)
    @Roles(Role.ROLE_MANAGER)
    async addStudentsToSubject(@Param('id') idSubject: number,@Body() body: {idUsers: string[]}, @Req() req, @Res() res, @Next() next: NextFunction) {
         try {   
            const currentUser = req.user
            await this.subjectService.addStudentsToSubject(idSubject, body, currentUser, next)
            return res.status(200).json({message: "Add Student To Subject Successfully"})         
         } catch (error) {
            console.log(error);
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' })
         }
        
    }
}
