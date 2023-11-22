import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import { IsInt, IsOptional, IsPositive } from 'class-validator';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {



    @IsOptional()
    @IsPositive()
    @IsInt()
    readonly ranking: number;



}
