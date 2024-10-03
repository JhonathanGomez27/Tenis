import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Usuario, rolEnum } from './entities/usuario.entity';
import { Repository } from 'typeorm';
import { handleDbError } from 'src/utils/error.message';
import { HashingService } from 'src/providers/hashing.service';
import { JugadoresService } from '../jugadores/jugadores.service';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { parse } from 'csv-parse';
import { categoria, Jugador } from '../jugadores/entities/jugadore.entity';
import { Pareja } from '../parejas/entities/pareja.entity';
import { FilesService } from '../files/files.service';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario) private usuarioRepository: Repository<Usuario>,
    @InjectRepository(Pareja) private readonly parejasRep: Repository<Pareja>,
    private readonly hashingService: HashingService,
    private readonly jugadoresService: JugadoresService,
    private readonly filesService: FilesService,
  ) {}

  async create(
    createUsuarioDto: CreateUsuarioDto,
  ): Promise<Usuario | { message: string }> {
    try {
      if (createUsuarioDto.contrasena) {
        createUsuarioDto.contrasena = await this.hashingService.hash(
          createUsuarioDto.contrasena.trim(),
        );
      }

      const usuario = this.usuarioRepository.create(createUsuarioDto);
      const usuarioGuardado = await this.usuarioRepository.save(usuario);

      if (usuarioGuardado.rol === rolEnum.USER) {
        const jugadorDto = {
          nombre_a_mostrar: createUsuarioDto.nombre_a_mostrar,
          //ranking: createUsuarioDto.ranking,
          rama: createUsuarioDto.rama,
          categoria: createUsuarioDto.categoria ?? null,
          categoria_dobles: createUsuarioDto.categoria_dobles ?? null,
          userid: usuarioGuardado,
        };
        const jugador = await this.jugadoresService.create(jugadorDto);
      }
      usuarioGuardado.contrasena = undefined;
      return usuarioGuardado;
    } catch (error) {
      const message = handleDbError(error);
      return { message };
    }
  }

  async editarInfo(id: number, editUsuarioDto: UpdateUsuarioDto) {
    try {
      //buscar si existe
      const userFound = await this.usuarioRepository.findOneBy({ id: id });

      if (!userFound) {
        throw new NotFoundException(
          'Usuario no encontrado, por favor verifique',
        );
      }

      if (editUsuarioDto.contrasena && editUsuarioDto.contrasena_antigua) {
        const isMatch = await this.hashingService.compare(
          editUsuarioDto.contrasena_antigua,
          userFound.contrasena,
        );

        if (!isMatch) throw new UnauthorizedException('Incorrect password');

        userFound.contrasena = await this.hashingService.hash(
          editUsuarioDto.contrasena.trim(),
        );
      }

      if (userFound.rol === rolEnum.USER) {
        const jugador = await this.jugadoresService.getJugadorByUserId(
          userFound,
        );

        if (!jugador) {
          throw new NotFoundException(
            'Jugador no encontrado, por favor verifique',
          );
        }
        if (editUsuarioDto.categoria)
          jugador.categoria = editUsuarioDto.categoria;

        if (editUsuarioDto.categoria_dobles)
          jugador.categoria_dobles = editUsuarioDto.categoria_dobles;

        if (editUsuarioDto.rama) jugador.rama = editUsuarioDto.rama;

        if (editUsuarioDto.ranking) jugador.ranking = editUsuarioDto.ranking;

        if (editUsuarioDto.nombre_a_mostrar) {
          userFound.nombre_a_mostrar = editUsuarioDto.nombre_a_mostrar;
          jugador.nombre_a_mostrar = editUsuarioDto.nombre_a_mostrar;
        }

        if (editUsuarioDto.nombre) userFound.nombre = editUsuarioDto.nombre;

        if (editUsuarioDto.apellido)
          userFound.apellido = editUsuarioDto.apellido;

        if (editUsuarioDto.correo) userFound.correo = editUsuarioDto.correo;

        //hacer el update de jugador
        await this.jugadoresService.actualizarJugador(jugador);

        //hacer el update de usuario
        await this.usuarioRepository.save(userFound);
      }
      return {
        message: 'Jugador actualizado Correctamente',
      };
    } catch (error) {
      const message = handleDbError(error);
      return { message };
    }
  }

  async getMisDatos(usuario: Usuario) {
    const userFound = await this.usuarioRepository.findOne({
      where: { id: usuario.id },
      relations: ['imagen_perfil'],
    });
    userFound.contrasena = undefined;

    if (!userFound) {
      throw new UnauthorizedException(
        'El Token No esta asociado a ningun Usuario, por favor verificar',
      );
    }

    if (userFound.rol === rolEnum.ADMIN) {
      return userFound;
    }

    let additionalInfo = {};
    let pare: Pareja;

    if (userFound.rol === rolEnum.USER) {
      const jugador = await this.jugadoresService.getJugadorByUserId(userFound);
      // jugador.id = undefined;
      jugador.nombre_a_mostrar = undefined;
      additionalInfo = { jugador };

      pare = await this.parejasRep.findOne({
        where: { jugador1: jugador },
        relations: ['jugador2'],
      });

      if (!pare)
        pare = await this.parejasRep.findOne({
          where: { jugador2: jugador },
          relations: ['jugador1'],
        });
    }

    let jugador1: Jugador, jugador2: Jugador, pareja: {};
    if (pare) {
      ({ jugador1, jugador2, ...pareja } = pare);
    }

    const datos = {
      ...userFound,
      ...additionalInfo,
      pareja: {
        ...pareja,
        jugador_pareja: jugador1 ? jugador1 : jugador2 ? jugador2 : null,
      },
    };

    return datos;
  }

  async cargarHistoricos(fileBuffer: Buffer) {
    const results = [];
    const csvString = fileBuffer.toString('utf-8');

    const jsonData = await this.parseCSVToJson(csvString);
    const usuarios = [];

    for (const dato of jsonData) {
      if (dato.rama === '1') {
        dato.rama = 'masculina';
      } else if (dato.rama === '2') {
        dato.rama = 'femenina';
      }
      console.log(dato);
      const createUsuarioDto = {
        nombre: dato.nombre,
        apellido: dato.Apellido,
        rol: rolEnum.USER,
        correo: null,
        contrasena: null,
      };

      if (dato.id_jugador === '1') {
        (createUsuarioDto.correo = 'admin@admin.com'),
          (createUsuarioDto.contrasena = 'Abcd1234.');
        createUsuarioDto.contrasena = await this.hashingService.hash(
          createUsuarioDto.contrasena.trim(),
        );
      }

      const usuario = this.usuarioRepository.create(createUsuarioDto);
      const usuarioGuardado = await this.usuarioRepository.save(usuario);

      if (usuarioGuardado.rol === rolEnum.USER) {
        const jugadorDto = {
          nombre_a_mostrar:
            createUsuarioDto.nombre + ' ' + createUsuarioDto.apellido,
          //ranking: createUsuarioDto.ranking,
          rama: dato.rama,
          categoria: categoria.A,
          categoria_dobles: categoria.A,
          userid: usuarioGuardado,
        };
        const jugador = await this.jugadoresService.create(jugadorDto);
      }

      usuarios.push(usuarioGuardado);
    }

    return jsonData;
  }

  private async parseCSVToJson(csvString: string): Promise<any[]> {
    return new Promise((resolve, reject) => {
      parse(
        csvString,
        {
          columns: true, // Trata la primera fila como encabezados
          skip_empty_lines: true,
        },
        (err, output) => {
          if (err) {
            reject(err);
          } else {
            resolve(output);
          }
        },
      );
    });
  }

  async ActualizarNombresYApellidos(fileBuffer: Buffer) {
    const results = [];
    const csvString = fileBuffer.toString('utf-8');

    const jsonData = await this.parseCSVToJson(csvString);
    const usuarios = [];

    for (const dato of jsonData) {
      const user = await this.usuarioRepository.findOneBy({
        id: dato.id_jugador,
      });

      if (user) {
        user.nombre = dato.nombre;
        user.nombre_a_mostrar = dato.Apellido;
        await this.usuarioRepository.save(user);

        //actualizar el nombre del jugador

        const jugador = await this.jugadoresService.getJugadorByUserId(user);
        jugador.nombre_a_mostrar = dato.nombre + ' ' + dato.Apellido;
        await this.jugadoresService.actualizarJugador(jugador);

        usuarios.push(user);
      }
    }

    return {
      message: 'Usuarios actualizados correctamente' + usuarios.length,
      usuarios,
    };
  }

  async contarUsuarios() {
    const total = await this.usuarioRepository.count();

    return {
      message: `Hay un total de ${total} usuarios registrados`,
      total,
    };
  }

  async uploadProfileImage(id: number, file: Express.Multer.File) {
    const usuario = await this.usuarioRepository.findOne({
      where: { id },
      relations: ['imagen_perfil'],
    });

    if (!usuario) throw new NotFoundException('Usuario no encontrado');

    if (usuario.imagen_perfil)
      await this.filesService.removeFile(usuario.imagen_perfil.id);

    const newFile = await this.filesService.createFile({
      filename: file.filename,
      path: file.path,
      mime_type: file.mimetype,
      resource_id: usuario.id,
      size: file.size,
    });

    await this.usuarioRepository.update(usuario.id, {
      imagen_perfil: newFile,
    });

    return newFile;
  }
}
