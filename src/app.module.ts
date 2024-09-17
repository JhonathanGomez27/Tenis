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
import { LlavesModule } from './modules/llaves/llaves.module';
import { JornadasModule } from './modules/jornadas/jornadas.module';
import { BracketModule } from './modules/bracket/bracket.module';

console.log(process.env.NODE_ENV);

@Module({
  imports: [
    BracketModule,
    TypeOrmModule.forRoot({
      type: 'mysql', // o el tipo de tu base de datos
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: '123456789',
      database: 'mx_tenis_db',
      entities: [__dirname + '/**/*.entity{.ts,.js}'],
      synchronize: true, // Solo para desarrollo, desactiva en producción  
    }),



    ConfigModule.forRoot({
      envFilePath: enviroments[process.env.NODE_ENV ?? '.dev.env'],
      load: [config],
      isGlobal: true,
      validationSchema: Joi.object({
        DATABASE_NAME: Joi.string().required(),
        DATABASE_PORT: Joi.number().required(),
      }),
    }),
    DatabaseModule,
    BracketModule,
    UsuariosModule,
    IamModule,
    JugadoresModule,
    TorneosModule,
    ParejasModule,
    PartidosModule,
    InscripcionesModule,
    GruposModule,
    LlavesModule,
    JornadasModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
