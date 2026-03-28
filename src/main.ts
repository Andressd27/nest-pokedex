import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v2'); // esto es para que todas las rutas tengan el prefijo /api

  app.useGlobalPipes( 
    new ValidationPipe({
      whitelist: true, // Elimina propiedades que no están definidas en el DTO
      forbidNonWhitelisted: true, // Lanza un error si se envían propiedades no definidas en el DTO
      transform: true, // Transforma los payloads a los tipos definidos en los DTOs
      transformOptions: {
        exposeUnsetFields: false, // No expone campos que no están definidos en el DTO
        enableImplicitConversion: true, // Habilita la conversión implícita de tipos (por ejemplo, de string a number)
      }
    }) 
  );

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
