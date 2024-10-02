import {
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { diskStorage } from 'multer';
import { extname, join } from 'path';

export const PATH_FILES = join(__dirname, '..', '..', '..', 'src', 'public');

// Configuración de Multer
export const storage = diskStorage({
  destination: PATH_FILES, // Carpeta donde se guardan los archivos
  filename: (req, file, cb) => {
    const fileExtName = extname(file.originalname); // Obtener la extensión del archivo
    const randomName = Array(32)
      .fill(null)
      .map(() => Math.round(Math.random() * 16).toString(16))
      .join('');
    cb(null, `${randomName}${fileExtName}`);
  },
});

export const filterImage = (req, file, cb) => {
  if (!file.mimetype.match(/\/(jpg|jpeg|png)$/)) {
    return cb(new BadRequestException('Only image files are allowed!'), false);
  }
  cb(null, true);
};

export const getLimitFile = (limit: number, unit: 'B' | 'KB' | 'MB' | 'GB') => {
  const units = ['B', 'KB', 'MB', 'GB'];
  const index = units.indexOf(unit.toUpperCase());
  if (index === -1) {
    throw new InternalServerErrorException(
      'Unidad inválida proporcionada. Las unidades válidas son B, KB, MB, GB.',
    );
  }
  const limitInBytes = limit * Math.pow(1024, index);
  return { fileSize: limitInBytes };
};

export const getFileName = (req, file, cb) => {
  const fileExtName = extname(file.originalname);
  const randomName = Array(32)
    .fill(null)
    .map(() => Math.round(Math.random() * 16).toString(16))
    .join('');
  cb(null, `${randomName}${fileExtName}`);
};
