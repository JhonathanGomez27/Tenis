import { Test, TestingModule } from '@nestjs/testing';
import { UsuariosService } from './usuarios.service';

describe('UsuariosService', () => {
  let service: UsuariosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsuariosService],
    }).compile();

    service = module.get<UsuariosService>(UsuariosService);
  });

  it('should be defined', () => { 
    expect(service).toBeDefined();
  });

  it('should create multiple users', async () => {
    const numberOfUsersToCreate = 100;

    for (let i = 0; i < numberOfUsersToCreate; i++) {
      const newUser = await service.create({
        // Datos del usuario (puedes generar datos aleatorios para pruebas)
        nombre: `Usuario${i}`,
        //rol: 'user',
        contrasena: 'contrasena123',
        correo: `usuario${i}@example.com`,
      });

      expect(newUser).toBeDefined();
      // Agrega más expectativas según tus necesidades
    }
  });
});
