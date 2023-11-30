import { Injectable } from '@nestjs/common';
import { CreateGrupoDto } from './dto/create-grupo.dto';
import { UpdateGrupoDto } from './dto/update-grupo.dto';
import { Grupo } from './entities/grupo.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MiExcepcionPersonalizada } from 'src/utils/exception';
import { Estado, Torneo } from '../torneos/entities/torneo.entity';
import { ResultadoPartidoDTO } from '../partidos/dto/resultado.dto';
import { ParticipanteDto } from './dto/participante.dto';

@Injectable()
export class GruposService {


  constructor(
    @InjectRepository(Grupo) private readonly grupoRepository: Repository<Grupo>,
    @InjectRepository(Torneo) private torneoRepository: Repository<Torneo>,

  ) { }


  async obtenerTodosLosGruposPorTorneo(id: number) {
    if (!id) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo', 400);
    }
    const torneo = await this.torneoRepository.findOneBy({ id })
    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 404);
    }

    const grupos = await this.grupoRepository.find({
      where: { torneo: { id: torneo.id } }
    });
    return grupos
  }

  async finalizarGruposPorTorneo(id: number) {
    if (!id) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo', 400);
    }
    const torneo = await this.torneoRepository.findOneBy({ id })
    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 404);
    }

    const grupos = await this.grupoRepository.find({
      where: { torneo: { id: torneo.id } }
    });

    for (const grupo of grupos) {
      grupo.completado = true
      await this.grupoRepository.save(grupo)
    }
    return {
      message: 'Se ha finalizado la fase de grupos, por favor sortear la siguiente fase'
    }
  }



  async create(createGrupoDto: CreateGrupoDto, idtorneo: number) {


    if (!idtorneo) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo', 400);
    }

    const torneo = await this.torneoRepository.findOne({
      where: { id: idtorneo },
      relations: ['grupos'],
    })

    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 404);
    }


    if (torneo.estado != Estado.SORTEO) {
      const message = `este torneo esta en estado ${torneo.estado} por lo cual es imposible realizar esta accion`
      throw new MiExcepcionPersonalizada(message, 403);
    }

    if (torneo.grupos.length >= torneo.cantidad_grupos) {
      const message = `este torneo solo admite ${torneo.cantidad_grupos} grupos por lo cual es imposible realizar esta accion`
      throw new MiExcepcionPersonalizada(message, 403);
    }

    for (const grupo of torneo.grupos) {
      if (grupo.nombre_grupo == createGrupoDto.nombre_grupo) {
        const message = `Ya existe un grupo con el nombre ${grupo.nombre_grupo} intentalo con otro`
        throw new MiExcepcionPersonalizada(message, 403);
      }
    }


    // for (const otrogrupo of torneo.grupos) {
    //   //console.log(otrogrupo)
    //   for (const partGrupo of otrogrupo.participantes) {
    //    // console.log('second',partGrupo)
    //    console.log(participante.id, partGrupo.id)
    //     if(participante.id == partGrupo.id && participante.id != undefined){            
    //       const message = `El participante ${participante.id} esta inscrito en este torneo en el grupo ${otrogrupo.nombre_grupo} por lo cual no puede estar inscrito dos veces`
    //       throw new MiExcepcionPersonalizada(message, 403);
    //     }                   
    //   }
    // }


    let ids = []
    for (const participante of createGrupoDto.participantes) {      
      ids.push(participante.id)
    }


    const hayRepetidos = ids.some((id, index) => {
      return ids.indexOf(id) !== index;
    });
    if (hayRepetidos) {
      const message = `Hay  participantes repetidos para este grupo, por favor verificar, no se ha creado el grupo`
      throw new MiExcepcionPersonalizada(message, 403);

    }





    let repetidos = 0
    if (createGrupoDto.participantes) {
      for (const grupo of torneo.grupos) {
        for (const partGrupo of grupo.participantes) {
          for (const participante of createGrupoDto.participantes) {
            console.log(participante.id,partGrupo.id )
            if(partGrupo.id == participante.id){
              repetidos ++
            }          
          }
        }
      }
    }
    if (repetidos > 0) {
      const message = `Hay  ${repetidos} participantes repetidos para este torneo, por favor verificar, no se ha creado el grupo`
      throw new MiExcepcionPersonalizada(message, 403);

    }

    createGrupoDto.torneo = torneo
    const grupo = await this.grupoRepository.create(createGrupoDto)
    return await this.grupoRepository.save(grupo)

  }



  async agregarParticipanteAGrupo(participante: ParticipanteDto, idtorneo: number, idgrupo: number){
   
    if (!idtorneo || !idgrupo) {
      throw new MiExcepcionPersonalizada('No se Proporciono un id de Torneo o Grupo', 400);
    }

    const torneo = await this.torneoRepository.findOne({
      where: { id: idtorneo },
      relations: ['grupos'],
    })

    if (!torneo) {
      throw new MiExcepcionPersonalizada('No se encontro el Torneo', 404);
    }
    if (torneo.estado != Estado.SORTEO) {
      const message = `este torneo esta en estado ${torneo.estado} por lo cual es imposible realizar esta accion`
      throw new MiExcepcionPersonalizada(message, 403);
    }
    const grupo = await this.grupoRepository.findOne({
      where : { id: idgrupo}
    })

    if (!grupo) {
      throw new MiExcepcionPersonalizada('No se encontro el Grupo', 404);
    }


    let coincidencias = 0;
    for (const grupobuscar of torneo.grupos) {
      if(grupobuscar.id == idgrupo){
        coincidencias++
      }      
    }

    if(coincidencias == 0){
      const message = `en el torneo  ${torneo.nombre} no existe ningun grupo con el id ${idgrupo}`
      throw new MiExcepcionPersonalizada(message, 403);

    }

    

   //let repetidos = 0
    if (participante &&  participante != undefined) {
      console.log(participante.id)
      for (const otrogrupo of torneo.grupos) {
        //console.log(otrogrupo)
        for (const partGrupo of otrogrupo.participantes) {
         // console.log('second',partGrupo)
         console.log(participante.id, partGrupo.id)
          if(participante.id == partGrupo.id && participante.id != undefined){            
            const message = `El participante ${participante.id} esta inscrito en este torneo en el grupo ${otrogrupo.nombre_grupo} por lo cual no puede estar inscrito dos veces`
            throw new MiExcepcionPersonalizada(message, 403);
          }                   
        }
      }
      grupo.participantes.push(participante);
      return await this.grupoRepository.save(grupo)
    }   







  }









}
