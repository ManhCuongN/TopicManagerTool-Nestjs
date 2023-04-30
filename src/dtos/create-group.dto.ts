
import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty,IsString,IsNumber,MaxLength, IsBoolean, IsInt, IsOptional, IsArray } from 'class-validator';
export class CreateGroupDto {
   
      @IsString()
      @IsNotEmpty()
      groupName: string

      @IsNotEmpty()
      @IsArray()
      idUsers: string[]

}