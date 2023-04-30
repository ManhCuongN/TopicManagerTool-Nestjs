import { Controller, Inject, Post, UseGuards,Body, Res, Req, UsePipes, ValidationPipe, Next, Put, Param } from '@nestjs/common';
import { GroupService } from './group.service';
import { RolesGuard } from 'src/guards/google.guard';
import { Roles } from 'src/guards/role.decorator';
import { Role } from 'src/constant/roleCode';
import { CreateGroupDto } from 'src/dtos/create-group.dto';

@Controller('group')
export class GroupController {

    constructor(@Inject(GroupService) private groupService: GroupService) {}

    @Post("/create")
    @UsePipes(new ValidationPipe())
    @UseGuards(RolesGuard)
    @Roles(Role.STUDENT)
    async createGroup(@Body() createGroup: CreateGroupDto, @Res() res, @Req() req, @Next() next ) {
        try {
            const currentUser = req.user
            await this.groupService.create(createGroup, currentUser)
            return res.status(200).json({message: "Create Group Successfully"})
        } catch (error) {
            next(error)
        }
    }

    @Put("/update/:id")
    @UseGuards(RolesGuard)
    @Roles(Role.STUDENT)
    async updateGroup(@Body() updateGroup, @Param('id') idGroup: number,  @Res() res, @Req() req, @Next() next ) {
        try {
            const currentUser = req.user
            await this.groupService.update(idGroup, updateGroup, currentUser)
            return res.status(200).json({message: "Create Group Successfully"})
        } catch (error) {
            next(error)
        }
    }
    
}
