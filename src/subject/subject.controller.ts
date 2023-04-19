import { Body, Controller, Get, HttpStatus, Inject, Param, Post, Put, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { SubjectService } from './subject.service';
import { Roles } from 'src/guards/role.decorator';
import { Role } from 'src/constant/roleCode';
import { RolesGuard } from 'src/guards/google.guard';
import { CreateSubjectDto } from 'src/dtos/create-subject.dto';
import { HTTP_CREATED_STATUS } from 'src/constant/httpCode';
import { UpdateSubjectDto } from 'src/dtos/update-subject.dto';

@Controller('subject')
export class SubjectController {

    constructor(@Inject(SubjectService) private subjectService: SubjectService) {}

    @Post('/create')
    @UsePipes(new ValidationPipe())
    @UseGuards(RolesGuard)
    @Roles(Role.STUDENT)
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
    @Roles(Role.STUDENT)
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
    @Roles(Role.STUDENT)
    async getGenaralInfo(@Param('id') id: number, @Req() req, @Res() res) {
         try {   
            const result =  await this.subjectService.getGenaralInfo(id)
            return res.status(200).json({data: result})         
         } catch (error) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Something went wrong' })
         }
        
    }
}
