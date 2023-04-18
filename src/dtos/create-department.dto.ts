
import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty,IsString,IsNumber,MaxLength, IsBoolean, IsInt, IsOptional } from 'class-validator';
export class CreateDepartmentDto {
   
      @IsString()
      @IsNotEmpty()
      title: string
}