
import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty,IsString,IsNumber,MaxLength, IsBoolean, IsInt, IsOptional } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
export class UpdateSubjectDto {
   
      @IsString()
      title: string

     @IsBoolean()
     isCloseStatus: boolean

     @IsNumber()
     limitRequest: number

}