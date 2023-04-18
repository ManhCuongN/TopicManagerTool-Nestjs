
import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty,IsString,IsNumber,MaxLength, IsBoolean, IsInt, IsOptional } from 'class-validator';
import { Exclude, Transform } from 'class-transformer';
export class UpdateTopicDto {
   
      @IsString()
      @Optional()
      title: string

      @IsString()
      @Optional()
      requiredSkills: string
      
      @IsString()
      @Optional()
      description?: string

      @IsInt()
      @Optional()
      numRequest: number

      @IsInt()
      @IsOptional()
      numRegisters: number

      @IsInt()
      @IsOptional()
      numMembers: number

      @IsInt()
      @IsOptional()
      limit: number

      
      @Exclude()
      @Optional()
      confirm: boolean

      @Exclude()
      @Optional()
      ready: boolean

}