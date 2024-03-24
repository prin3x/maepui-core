import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app: NestExpressApplication = await NestFactory.create(AppModule);

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Accept',
  });

  app.useBodyParser('json', { limit: '10mb' });

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );
  const ansciiStart = `
  ██████╗░░█████╗░███████╗███████╗░█████╗░██╗░░██╗
  ██╔══██╗██╔══██╗██╔════╝██╔════╝██╔══██╗██║░░██║
  ██████╔╝██║░░██║█████╗░░█████╗░░██║░░██║███████║
  ██╔══██╗██║░░██║██╔══╝░░██╔══╝░░██║░░██║██╔══██║
  ██║░░██║╚█████╔╝███████╗███████╗╚█████╔╝██║░░██║
  ╚═╝░░╚═╝░╚════╝░╚══════╝╚══════╝░╚════╝░╚═╝░░╚═╝
  `;

  const NODE_ENV = process.env.NODE_ENV || 'development';

  await app.listen(process.env.PORT || 8080, () => {
    console.log(ansciiStart);
    console.log(`Server is running on http://localhost:${process.env.PORT || 8080} `);
    console.log(`Environment ==> ${NODE_ENV}`);
  });
}
bootstrap();
