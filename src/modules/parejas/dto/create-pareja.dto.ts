import { Injectable } from "@nestjs/common";
import { IsEnum, IsNotEmpty, NotEquals, Validate, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator"
import { Jugador } from "src/modules/jugadores/entities/jugadore.entity"




export function JugadoresDiferentes(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'jugadoresDiferentes',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const jugador1 = value;
            const jugador2 = (args.object as any)[args.property.replace('1', '2')];
  
            return jugador1 !== jugador2;
          },
          defaultMessage(args: ValidationArguments) {
            return 'Los jugadores deben ser diferentes';
          },
        },
      });
    };
  }



export class CreateParejaDto {    
  

    // @IsNumber()
    // @IsPositive()
    // ranking: number

    @IsEnum(['masculina', 'femenina'])
    readonly rama: 'masculina' | 'femenina'

    @IsEnum(['A', 'B+', 'B', 'C+', 'C', 'D'])
    readonly categoria: 'A' | 'B+' | 'B' | 'C+' | 'C' | 'D' 
    
    @IsNotEmpty()
    @JugadoresDiferentes()
    readonly jugador1: Jugador

    @IsNotEmpty()   
    readonly jugador2: Jugador



}
