import {
    registerDecorator,
    ValidationOptions,
    ValidationArguments,
    ValidatorConstraint,
    ValidatorConstraintInterface
} from 'class-validator';

@ValidatorConstraint({ async: true })
export class JugadoresOParejas implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const { object } = args;

        const pareja1 = object['pareja1'];
        const pareja2 = object['pareja2'];
        const jugador1 = object['jugador1'];
        const jugador2 = object['jugador2'];

        if ((pareja1 || pareja2) && (jugador1 || jugador2)) {
            return false; // No puede proporcionar tanto parejas como jugadores al mismo tiempo.
        }

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return 'No se pueden proporcionar parejas y jugadores al mismo tiempo';
    }
}

export function ParejasOJugadores(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: JugadoresOParejas,
        });
    };
}



@ValidatorConstraint({ async: true })
export class ParejasOJugadoresRequeridos implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const { object } = args;        

        const pareja1 = object['pareja1'];
        const pareja2 = object['pareja2'];
        const jugador1 = object['jugador1'];
        const jugador2 = object['jugador2'];

        if (!(pareja1 && pareja2) && !(jugador1 && jugador2)) {
            return false; // Debe proporcionar al menos parejas o jugadores
        }

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Debe proporcionar al menos parejas o jugadores';
    }
}

export function ParejasOJugadoresObligatorio(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: ParejasOJugadoresRequeridos,
        });
    };
}







export function ParejasDiferentes(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
      registerDecorator({
        name: 'parejasDiferentes',
        target: object.constructor,
        propertyName: propertyName,
        options: validationOptions,
        validator: {
          validate(value: any, args: ValidationArguments) {
            const pareja1 = value;
            const pareja2 = (args.object as any)[args.property.replace('1', '2')];
  
            return pareja1 !== pareja2;
          },
          defaultMessage(args: ValidationArguments) {
            return 'Las Parejas deben ser diferentes';
          },
        },
      });
    };
}


