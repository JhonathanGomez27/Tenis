// utils/error-handling.ts

import { ConflictException, } from "@nestjs/common";

export function handleDbError(error: any): string {
  //console.log('error hand', error)
  
    if (error.code === 'ER_DUP_ENTRY') {
     
      //return 'Ya existe un registro con esa información.';
      throw new ConflictException('Ya existe un registro con esa información.')
    }
    if (error.status == '409') {     
      //return 'Ya existe un registro con esa información.';
      throw new ConflictException('Por favor ingrese un email y/o contraseña válida.')
    }
    
    else {
      // Puedes agregar más casos según tus necesidades
      return 'Ha ocurrido un error en la base de datos.';
    }
  }
  