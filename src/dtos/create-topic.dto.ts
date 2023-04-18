
import { IsEmail, IsNotEmpty,IsString,IsNumber,MaxLength, IsBoolean, IsInt, IsOptional } from 'class-validator';
export class CreateTopicDto {
   
      @IsString()
      @IsNotEmpty()
      title: string

      @IsString()
      requiredSkills: string
      
      @IsString()
      description: string

      @IsInt()
      numRequest: number

      @IsInt()
      @IsOptional()
      numRegisters: number

      @IsInt()
      numMembers: number

      @IsInt()
      limit: number

}