import { Body, Controller, Get, Inject, Param, Patch, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { TopicService } from './topic.service';
import { RolesGuard } from 'src/guards/google.guard';
import { Roles } from 'src/guards/role.decorator';
import { Role } from 'src/constant/roleCode';
import { CreateTopicDto } from 'src/dtos/create-topic.dto';
import { HTTP_CREATED_STATUS } from 'src/constant/httpCode';
import { UpdateTopicDto } from 'src/dtos/update-topic.dto';
import { Response } from 'express';


@Controller('topic')
export class TopicController {
    constructor(
        @Inject(TopicService) private topicService: TopicService
    ) {}

    @Get()
    @UsePipes(new ValidationPipe())
    @UseGuards(RolesGuard)
    @Roles(Role.ROLE_DEAN, Role.ROLE_TEACHER, Role.ROLE_HD)
    async createTopic(@Body() createTopic: CreateTopicDto, @Res() res, @Req() req) {
       const userCurrent = req.user  
       const newTopic = await this.topicService.create(createTopic, userCurrent)   
       return res.status(HTTP_CREATED_STATUS).json(newTopic)   
    }


    @Patch(':id')
    @UsePipes(new ValidationPipe({
        transform: true,
    }))
    @UseGuards(RolesGuard)
    @Roles(Role.ROLE_DEAN, Role.ROLE_TEACHER, Role.ROLE_MANAGER, Role.ROLE_HD)
    async updateTopic(@Param('id') id: string, @Body() updateTopic: UpdateTopicDto, @Res() res: Response) {  
       
        try {
            await this.topicService.update(id, updateTopic);
            return res.status(200).json({message: "Update Successfully"});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }


    @Patch('/status/:id')
    @UseGuards(RolesGuard)
    @Roles(Role.ROLE_DEAN, Role.ROLE_HD)
    async updateStatusTopic(@Param('id') id: string, @Body() status: Boolean, @Res() res: Response, @Req() req) {  
      
        try {
           const currentUser = req.user
           await this.topicService.updateStatus(id,status,currentUser)
           return res.status(200).json({message: "Update Stutus Topic Successfully"});
        } catch (error) {
            console.log(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    @Post('/add/note/:id')
    @UseGuards(RolesGuard)
    @Roles(Role.ROLE_DEAN, Role.ROLE_HD)
    async addNote(@Param('id') id: string, @Body() note: string, @Req() req, @Res() res){
        try {
            const currentUser = req.user
            await this.topicService.addNote(id, note, currentUser)
            res.status(200).json({message: "Add Note Successfully"})
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Internal server error' })
        }
    }

    
}
