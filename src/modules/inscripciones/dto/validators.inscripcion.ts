import { ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface, registerDecorator } from "class-validator";


@ValidatorConstraint({ async: true })
export class ParejaOJugadorRequeridos implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const { object } = args;        

        const pareja = object['pareja'];       
        const jugador = object['jugador'];
       

        if (!(pareja) && !(jugador)) {
            return false; // Debe proporcionar al menos parejas o jugadores
        }

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Debe proporcionar al menos Una Pareja o un Jugador';
    }
}

export function ParejaOJugadorObligatorio(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: ParejaOJugadorRequeridos,
        });
    };
}



@ValidatorConstraint({ async: true })
export class JugadorOPareja implements ValidatorConstraintInterface {
    validate(value: any, args: ValidationArguments) {
        const { object } = args;

        const pareja = object['pareja'];       
        const jugador = object['jugador'];
       

        if (pareja  && jugador) {
            return false; // No puede proporcionar tanto parejas como jugadores al mismo tiempo.
        }

        return true;
    }

    defaultMessage(args: ValidationArguments) {
        return 'Se debe Inscribir una Pareja o Un Jugador, No Los dos';
    }
}

export function ParejaOJugador(validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints: [],
            validator: JugadorOPareja,
        });
    };
}