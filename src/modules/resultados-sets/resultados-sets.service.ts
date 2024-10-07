import { Injectable } from '@nestjs/common';
import { CreateResultadosSetDto } from './dto/create-resultados-set.dto';
import { UpdateResultadosSetDto } from './dto/update-resultados-set.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Modalidad, ResultadosSet } from './entities/resultados-set.entity';
import { Torneo } from '../torneos/entities/torneo.entity';
import { Partido } from '../partidos/entities/partido.entity';
import { Jugador } from '../jugadores/entities/jugadore.entity';

@Injectable()
export class ResultadosSetsService {
  constructor(
    @InjectRepository(ResultadosSet)
    private resultadosSetRepository: Repository<ResultadosSet>,
    @InjectRepository(Torneo)
    private torneoRepository: Repository<Torneo>,
    @InjectRepository(Partido)
    private partidoRepository: Repository<Partido>,
    @InjectRepository(Jugador)
    private jugadorRepository: Repository<Jugador>,
  ) {}

  async create(createResultadosSetDto: CreateResultadosSetDto){
    const torneo = await this.torneoRepository.findOneBy({ id: createResultadosSetDto.id_torneo });
    const partido = await this.partidoRepository.findOneBy({ id: createResultadosSetDto.id_partido });
    const ganador = await this.jugadorRepository.findOneBy({ id: createResultadosSetDto.ganador });
    const perdedor = await this.jugadorRepository.findOneBy({ id: createResultadosSetDto.perdedor });

    if (!torneo || !partido || !ganador || !perdedor) {
      throw new Error('Una de las entidades relacionadas no fue encontrada');
    }

    const resultadoSet = this.resultadosSetRepository.create({
      torneo, 
      partido, 
      ganador, 
      perdedor, 
      puntos_ganador: createResultadosSetDto.puntos_ganador,
      puntos_perdedor: createResultadosSetDto.puntos_perdedor,
      modalidad: createResultadosSetDto.modalidad, 
      fase: createResultadosSetDto.fase
    });

    return await this.resultadosSetRepository.save(resultadoSet)

  }

  async count(where: any) {
    return this.resultadosSetRepository.count({
      where: {
        ganador: { id: where.ganador.id }, 
      },
      relations: ['ganador'], 
    });
  }

  async countSubcampeonatos(id: number) {
    return this.resultadosSetRepository.count({
      where: {
        perdedor: { id }, 
        fase: 'final', 
      },
      relations: ['perdedor'], 
    });
  }
  async countCampeon(id: number) {
    return this.resultadosSetRepository.count({
      where: {
        ganador: { id }, 
        fase: 'final', 
      },
      relations: ['ganador'], 
    });
  }

  async countGanadosSingles(id: number) {
    return this.resultadosSetRepository.count({
      where: {
        ganador: { id }, 
        modalidad: Modalidad.SINGLES, 
      },
      relations: ['ganador'], 
    });
  }
  
  async countPerdidosSingles(id: number) {
    return this.resultadosSetRepository.count({
      where: {
        perdedor: { id }, 
        modalidad: Modalidad.SINGLES, 
      },
      relations: ['perdedor'], 
    });
  }
  
  async countGanadosPareja(id: number) {
    return this.resultadosSetRepository.count({
      where: {
        ganador: { id }, 
        modalidad: Modalidad.PAREJA, 
      },
      relations: ['ganador'], 
    });
  }
  
  async countPerdidosPareja(id: number) {
    return this.resultadosSetRepository.count({
      where: {
        perdedor: { id }, 
        modalidad: Modalidad.PAREJA, 
      },
      relations: ['perdedor'], 
    });
  }

  findAll() {
    return `This action returns all resultadosSets`;
  }

  findOne(id: number) {
    return `This action returns a #${id} resultadosSet`;
  }

  update(id: number, updateResultadosSetDto: UpdateResultadosSetDto) {
    return `This action updates a #${id} resultadosSet`;
  }

  remove(id: number) {
    return `This action removes a #${id} resultadosSet`;
  }
}
