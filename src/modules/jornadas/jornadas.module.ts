import { Module } from '@nestjs/common';
import { JornadasService } from './jornadas.service';
import { JornadasController } from './jornadas.controller';
import { Jornada } from './entities/jornada.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Jornada]),
   
  ],
  controllers: [JornadasController],
  providers: [JornadasService],
  exports: [JornadasService]
})
export class JornadasModule {}
