import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';

import { Repository } from 'typeorm';

@Injectable()
export class DatabaseService {
  constructor(
    // @InjectRepository(Usuario) // Reemplaza TuEntidad con una de tus entidades
    // private readonly usuariosRepository: UsuariosRepository
   
  ) {
    //console.log('base de datos conectada')
  }

  // Agrega métodos para interactuar con la base de datos según tus necesidades
}
