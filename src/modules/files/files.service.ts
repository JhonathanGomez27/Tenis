import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './entities/file.entity';
import { Repository } from 'typeorm';
import { existsSync, promises as fs } from 'fs';
import path from 'path';

@Injectable()
export class FilesService {
  constructor(
    @InjectRepository(File) private readonly filesRep: Repository<File>,
  ) {}

  async createFile(fileData: Partial<File>): Promise<File> {
    const file = this.filesRep.create(fileData);
    return this.filesRep.save(file);
  }

  async getFilePath(id: string) {
    const file = await this.filesRep.findOne({
      where: { id },
      select: ['path'],
    });
    if (!file) throw new BadRequestException('Archivo no encontrado');
    if (!existsSync(file.path)) {
      throw new BadRequestException('Archivo no encontrado');
    }
    return file.path;
  }

  async getFilesFromResource(resource_id: number) {
    const files = await this.filesRep.find({
      where: { resource_id },
      select: ['path'],
    });
    return files;
  }

  async removeFile(id: string): Promise<void> {
    const file = await this.filesRep.findOne({
      where: { id },
      select: [
        'id',
        'filename',
        'path',
        'mime_type',
        'size',
        'resource_id',
        'created_at',
        'updated_at',
        'deleted_at',
      ],
    });

    if (file) {
      await fs.unlink(file.path);
      // await this.filesRep.remove(file);
    }
  }
}
