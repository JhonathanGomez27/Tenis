import { PartialType } from '@nestjs/swagger';
import { CreateResultadosSetDto } from './create-resultados-set.dto';

export class UpdateResultadosSetDto extends PartialType(CreateResultadosSetDto) {}
