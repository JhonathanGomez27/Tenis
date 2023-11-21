import { PartialType } from '@nestjs/mapped-types';
import { CreateJugadorDto } from './create-jugadore.dto';

export class UpdateJugadorDto extends PartialType(CreateJugadorDto) {}
