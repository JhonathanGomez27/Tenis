import { Module } from '@nestjs/common';
import { UsuariosService } from './usuarios.service';
import { UsuariosController } from './usuarios.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Usuario } from './entities/usuario.entity';
import { HashingService } from 'src/providers/hashing.service';
import { BcryptService } from 'src/providers/bcrypt.service';
import { JugadoresModule } from '../jugadores/jugadores.module';
import { IamModule } from '../iam/iam.module';
import { Pareja } from '../parejas/entities/pareja.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, Pareja]),
    IamModule,
    JugadoresModule,
  ],
  controllers: [UsuariosController],
  providers: [
    {
      provide: HashingService,
      useClass: BcryptService,
    },
    UsuariosService,
  ],
  exports: [UsuariosService],
})
export class UsuariosModule {}
