import { Controller, Get, Param, Res } from '@nestjs/common';
import { FilesService } from './files.service';
import { Response } from 'express';

@Controller('files')
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get(':id')
  async getFile(@Param('id') id: string, @Res() res: Response) {
    const filePath = await this.filesService.getFilePath(id);
    return res.sendFile(filePath);
  }
}
