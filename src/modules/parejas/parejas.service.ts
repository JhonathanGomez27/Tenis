import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateParejaDto } from './dto/create-pareja.dto';
import { UpdateParejaDto } from './dto/update-pareja.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Pareja } from './entities/pareja.entity';
import { Repository } from 'typeorm';
import { handleDbError } from 'src/utils/error.message';
import { MiExcepcionPersonalizada } from 'src/utils/exception';

@Injectable()
export class ParejasService {

  constructor(
    @InjectRepository(Pareja) private readonly parejaRepository: Repository<Pareja>
  ) { }


  async create(createParejaDto: CreateParejaDto) {

    try {
      const pareja = this.parejaRepository.create(createParejaDto);
      const parejaGuardada = await this.parejaRepository.save(pareja)
      return parejaGuardada

    } catch (error) {
      const message = handleDbError(error)
      return { message }
    }

  }


  async update(id: number, updateParejaDto: UpdateParejaDto) {

    try {

      //buscar si existe

      const parejaFound = await this.parejaRepository.findOneBy({id: id})

      if (!parejaFound) {
        throw new NotFoundException('Pareja no encontrada, por favor verifique');
      }


      if(parejaFound.jugador1 === updateParejaDto.jugador2 || parejaFound.jugador2 === updateParejaDto.jugador1 ){
        throw new MiExcepcionPersonalizada('Los jugadores deben ser diferentes', 430); 

      }

      if (updateParejaDto.categoria)
      parejaFound.categoria = updateParejaDto.categoria

      if (updateParejaDto.rama)
      parejaFound.rama = updateParejaDto.rama


      if (updateParejaDto.ranking)
      parejaFound.ranking = updateParejaDto.ranking

      if(updateParejaDto.jugador1)
      parejaFound.jugador1 = updateParejaDto.jugador1

      if(updateParejaDto.jugador2)
      parejaFound.jugador2 = updateParejaDto.jugador2


      await this.parejaRepository.save(parejaFound)

      return{
        message: 'Pareja Actuzalizada correctamente'
      }

    } catch (error) {
      //console.log('error', error)

      

      //return error
      const message = handleDbError(error)
      return { message }

    }



  }





}
