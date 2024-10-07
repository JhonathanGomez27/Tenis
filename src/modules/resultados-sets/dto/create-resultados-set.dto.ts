import { IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber } from 'class-validator';
import { Modalidad } from '../entities/resultados-set.entity';
import { Fases } from 'src/modules/torneos/entities/torneo.entity';

export class CreateResultadosSetDto {
  @IsInt()
  id_torneo: number;

  @IsInt()
  id_partido: number;

  @IsInt()
  ganador: number;

  @IsInt()
  perdedor: number;

  @IsNumber()
  puntos_ganador: number;

  @IsNumber()
  puntos_perdedor: number;

  @IsNotEmpty()
  @IsEnum(Modalidad)
  modalidad: Modalidad;
  @IsNotEmpty()
  @IsIn(Object.values(Fases))
  fase: 'grupos' | 'octavos' | 'cuartos' | 'semifinales' | 'final' | 'otra';
}
