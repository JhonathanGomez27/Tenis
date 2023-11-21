import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.enableCors();
  app.setGlobalPrefix("tenis");
  app.useGlobalPipes(new ValidationPipe(
    {
      //whitelist: true,
      //forbidNonWhitelisted: true,
      transformOptions: {
        enableImplicitConversion: true,
      }
    }
  ));


  const config = new DocumentBuilder().setTitle('Admin Tenis API').setDescription('The Admind Tenis API description').setVersion('1.0').addTag('adminTenis').build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);



  await app.listen(3000);
}
bootstrap();
