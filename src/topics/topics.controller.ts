import { Body, Controller, Get, Inject, Post, Req, Res, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { Role } from 'src/constant/roleCode';
import { CreateTopicDto } from 'src/dtos/create-topic.dto';
import { RolesGuard } from 'src/guards/google.guard';
import { Roles } from 'src/guards/role.decorator';
import { TopicService } from './topic.service';

@Controller('topic/api')
export class TopicsController {

    constructor(
        @Inject(TopicService) private topicService: TopicService
    ){}

    @Get()
    @UsePipes(new ValidationPipe())
    @UseGuards(RolesGuard)
    @Roles(Role.STUDENT)
    async createTopic(@Body() createTopic: CreateTopicDto, @Req() req) {
         const userCurrent = req.user  
         this.topicService.test()      
    }
}
