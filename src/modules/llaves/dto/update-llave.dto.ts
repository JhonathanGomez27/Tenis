import { PartialType } from '@nestjs/mapped-types';
import { CreateLlaveDto } from './create-llave.dto';

export class UpdateLlaveDto extends PartialType(CreateLlaveDto) {}
