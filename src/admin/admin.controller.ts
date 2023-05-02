import { Body, Controller, Inject, Post } from '@nestjs/common';
import { AdminService } from './admin.service';


@Controller('admin')
export class AdminController {
    
    constructor( @Inject(AdminService) private adminService: AdminService){}
    @Post()
    login(@Body() body: string) {
        return this.adminService.login(body)
    }
}
