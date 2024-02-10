import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';
import { Usuario } from 'src/modules/usuarios/entities/usuario.entity';
import { UsuariosModule } from 'src/modules/usuarios/usuarios.module';


@Module({
  imports: [
    ConfigModule, 
    TypeOrmModule.forRoot({
      type: 'mysql', // o el tipo de tu base de datos
      host: 'localhost',
      port: 3306,
      username: 'admin_tenis',
      password: 'QTCZyH6i',
      database:  'admin_tenis',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      // Solo para desarrollo, desactiva en producción dependiendo de el ambiente que estes trabajando, hacer un if ternario para que se active o desactive justo en la linea de abajo
      synchronize: true ? true : false, 

      
      
    })

  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule { }


