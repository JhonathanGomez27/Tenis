import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatabaseService } from './database.service';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configSer: ConfigService) => ({
        type: "mysql",
        host: configSer.get<string>('config.database.hostname'),
        port: configSer.get<number>('config.database.port'),
        username: configSer.get<string>('config.database.user'),
        password: configSer.get<string>('config.database.password'),
        database: configSer.get<string>('config.database.dbname'),
        entities: [__dirname + '/**/*.entity{.ts,.js}'],
        synchronize: true,
        autoLoadEntities: true
      })
    })
  ],
  providers: [DatabaseService],
  exports: [DatabaseService],
})
export class DatabaseModule {}
