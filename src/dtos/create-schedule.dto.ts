
import { Optional } from '@nestjs/common';
import { IsEmail, IsNotEmpty,IsString,IsNumber,MaxLength, IsBoolean, IsInt, IsOptional, IsDateString, IsEmpty } from 'class-validator';
export class CreateSchelude {
   
      
      @IsDateString({}, { each: true })
      @IsNotEmpty()
      from: Date[];
    
      @IsDateString({}, { each: true })
      @IsNotEmpty()
      to: Date[];

     
    
      

}