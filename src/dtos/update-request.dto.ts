
import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty,IsString,IsNumber,MaxLength, IsBoolean, IsInt, IsOptional, IsArray, IsEnum } from 'class-validator';
import { STATUS } from 'src/constant/httpCode';
export class UpdateRequestDto {
   
      @IsEnum(STATUS)
      @IsNotEmpty()
      status: string


      @IsString()
      note: string

}