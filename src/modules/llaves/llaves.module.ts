import { Module } from '@nestjs/common';
import { LlavesService } from './llaves.service';
import { LlavesController } from './llaves.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Llave } from './entities/llave.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Llave])
  ],
  controllers: [LlavesController],
  providers: [LlavesService],
  exports: [LlavesService]
})
export class LlavesModule {}
