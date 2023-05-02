import { Body, Controller, Inject, Next, Param, Patch, Post, Res, UseGuards } from '@nestjs/common';
import { RequestService } from './request.service';
import { RolesGuard } from 'src/guards/google.guard';
import { Roles } from 'src/guards/role.decorator';
import { Role } from 'src/constant/roleCode';
import { UpdateRequestDto } from 'src/dtos/update-request.dto';

@Controller('request')
export class RequestController {

    constructor(@Inject(RequestService) private requestService: RequestService) {}

    @Post('/create/:idTopic')
    async createRequest(@Body() createRequest, @Param('idTopic') idTopic: number, @Res() res, @Next() next ) {
        try {
          await this.requestService.create(idTopic, createRequest)  
          return res.status(200).json({message: "Create Request Successfully"})
        } catch (error) {
            next(error)
        }
    }

    @Patch('/update/status/:idRequest')
    @UseGuards(RolesGuard)
    @Roles(Role.ROLE_TEACHER)
    async updateRequest(@Body() updateRequest: UpdateRequestDto, @Param('idRequest') idRequest: number, @Res() res, @Next() next ) {
        try {
          await this.requestService.updateStatusRequest(idRequest, updateRequest)  
          return res.status(200).json({message: "Update Status Request Successfully"})
        } catch (error) {
            next(error)
        }
    }

    @Patch('/update/note/:idRequest')
    @UseGuards(RolesGuard)
    @Roles(Role.ROLE_TEACHER)
    async updateNoteRequest(@Body() body: Object, @Param('idRequest') idTopic: number, @Res() res, @Next() next ) {
        try {
          await this.requestService.updateNoteRequest(idTopic, body)  
          return res.status(200).json({message: "Update Note Request Successfully"})
        } catch (error) {
            console.log(error);
            
            next(error)
        }
    }
}
