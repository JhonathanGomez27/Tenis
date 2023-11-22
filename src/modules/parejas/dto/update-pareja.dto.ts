import { PartialType } from '@nestjs/mapped-types';
import { CreateParejaDto } from './create-pareja.dto';

export class UpdateParejaDto extends PartialType(CreateParejaDto) {}
