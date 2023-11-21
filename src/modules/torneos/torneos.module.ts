import { Module } from '@nestjs/common';
import { TorneosService } from './torneos.service';
import { TorneosController } from './torneos.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Torneo } from './entities/torneo.entity';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Torneo]),
    IamModule
  ],
  controllers: [TorneosController],
  providers: [TorneosService],
  exports: [TorneosService]
})
export class TorneosModule {}
