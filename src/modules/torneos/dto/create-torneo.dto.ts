import { IsDate, IsIn, IsJSON, IsNotEmpty, IsNumber, IsObject, IsOptional, IsString, Validate, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";
import { Fases, Modalidad, Tipo } from "../entities/torneo.entity";
import { categoria, rama } from "src/modules/jugadores/entities/jugadore.entity";
import { Type } from "class-transformer"; 




@ValidatorConstraint({ name: 'isValidCantidadJornadasCruzadas', async: false })
export class IsValidCantidadJornadasCruzadasConstraint implements ValidatorConstraintInterface {
  validate(value: number, args: ValidationArguments) {
    const cantidadJornadasRegulares = args.object['cantidad_jornadas_regulares'];

    return value <= cantidadJornadasRegulares;
  }

  defaultMessage(args: ValidationArguments) {
    return 'La cantidad de jornadas cruzadas no puede ser mayor que la cantidad de jornadas regulares';
  }
}


export function IsValidCantidadJornadasCruzadas(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        constraints: [],
        validator: IsValidCantidadJornadasCruzadasConstraint,
      });
    };
  }



export class CreateTorneoDto {


    @IsNotEmpty()
    @IsString()
    readonly nombre: string

    @IsNotEmpty()
    @IsIn(Object.values(Tipo))
    readonly tipo_torneo: 'regular' | 'escalera';

    @IsNotEmpty()
    @IsIn(Object.values(rama))
    readonly rama: 'masculina' | 'femenina' | 'mixta';

    @IsNotEmpty()
    @IsIn(Object.values(Modalidad))
    readonly modalidad: 'singles' | 'dobles';

    @IsNotEmpty()
    @IsNumber()
    readonly cantidad_grupos: number

    @IsNotEmpty()
    @IsIn(Object.values(categoria))
    readonly categoria: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D'

    @IsObject()
    readonly configuracion_sets: object

    @IsNotEmpty()
    @IsIn(Object.values(Fases))
    readonly fase_actual: 'grupos' | 'octavos' | 'cuartos' | 'semifinales' | 'final' | 'otra';

    @IsDate()
    @Type(() => Date)
    readonly fecha_inicio: Date

    @IsDate()
    @Type(() => Date)
    readonly fecha_fin: Date


    @IsOptional()
    @IsNumber()
    readonly cantidad_jornadas_regulares: number

    @IsOptional()
    @IsNumber()
    @IsValidCantidadJornadasCruzadas({
        message: 'La cantidad de jornadas cruzadas no puede ser mayor que la cantidad de jornadas regulares',
      }) 
    readonly cantidad_jornadas_cruzadas: number

}
