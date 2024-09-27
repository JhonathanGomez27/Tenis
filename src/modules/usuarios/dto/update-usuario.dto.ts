import { PartialType } from '@nestjs/mapped-types';
import { CreateUsuarioDto } from './create-usuario.dto';
import {
  IsInt,
  IsOptional,
  IsPositive,
  IsString,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { string } from 'joi';

export class UpdateUsuarioDto extends PartialType(CreateUsuarioDto) {
  @IsString()
  @Transform(({ value }: { value: string }) => value.trim())
  @IsOptional()
  @MinLength(6)
  contrasena_anitgua?: string;

  @IsOptional()
  @IsPositive()
  @IsInt()
  readonly ranking: number;
}
