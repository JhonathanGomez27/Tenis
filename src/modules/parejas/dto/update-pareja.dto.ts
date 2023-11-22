import { PartialType } from '@nestjs/mapped-types';
import { CreateParejaDto } from './create-pareja.dto';
import { IsInt, IsNumber, IsOptional, IsPositive } from 'class-validator';

export class UpdateParejaDto extends PartialType(CreateParejaDto) {

    @IsNumber()
    @IsPositive()
    @IsInt()
    @IsOptional()
    readonly ranking?: number
}
