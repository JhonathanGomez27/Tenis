import { IsOptional, IsString } from 'class-validator';

export class FiltersJugadorDto {
  @IsString()
  @IsOptional()
  readonly nombre_a_mostrar?: string;

  @IsString()
  @IsOptional()
  readonly rama?: string;

  @IsString()
  @IsOptional()
  readonly categoria?: string;
}
