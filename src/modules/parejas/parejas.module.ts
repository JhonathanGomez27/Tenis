import { Module } from '@nestjs/common';
import { ParejasService } from './parejas.service';
import { ParejasController } from './parejas.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Pareja } from './entities/pareja.entity';
import { IamModule } from '../iam/iam.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Pareja]),
    IamModule
  ],
  controllers: [ParejasController],
  providers: [ParejasService],
  exports: [ParejasService]
})
export class ParejasModule { }
