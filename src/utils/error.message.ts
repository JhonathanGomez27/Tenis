// utils/error-handling.ts

import { ConflictException, NotFoundException, } from "@nestjs/common";

export function handleDbError(error: any): string {
  if (error.code === 'ER_DUP_ENTRY') {   
    throw new ConflictException('Ya existe un registro con esa información.')
  }
  if (error.status == '409') {    
    throw new ConflictException('Por favor ingrese un email y/o contraseña válida.')
  }
  if (error.code === 'ER_NO_REFERENCED_ROW_2') {
    throw new NotFoundException('El registro que intentas insertar hace referencia a una llave foranea que no existe ')
  }
  else {   
    return 'Ha ocurrido un error en la base de datos.';
  }
}
