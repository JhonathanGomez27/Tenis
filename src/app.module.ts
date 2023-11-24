import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { enviroments } from './common/enviroments';
import config from './config';
import * as Joi from 'joi';
import { DatabaseModule } from './database/database.module';
import { UsuariosModule } from './modules/usuarios/usuarios.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IamModule } from './modules/iam/iam.module';
import { JugadoresModule } from './modules/jugadores/jugadores.module';
import { TorneosModule } from './modules/torneos/torneos.module';
import { ParejasModule } from './modules/parejas/parejas.module';
import { PartidosModule } from './modules/partidos/partidos.module';
import { InscripcionesModule } from './modules/inscripciones/inscripciones.module';
import { GruposModule } from './modules/grupos/grupos.module';



@Module({
  imports: [ 
    TypeOrmModule.forRoot({
      type: 'mysql', // o el tipo de tu base de datos
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '',
      database:  'admin_tenis',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo, desactiva en producción  
    }),
  
    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV ?? "dev"],
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
      })
    }),
   
    UsuariosModule,
    IamModule,
    JugadoresModule,
    TorneosModule,
    ParejasModule,
    PartidosModule,
    InscripcionesModule,
    GruposModule
   
    
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
