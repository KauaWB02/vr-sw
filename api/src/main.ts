import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const GLOBAL_API_PREFIX = 'api';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);

  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      forbidUnknownValues: false,
      validationError: { target: false },
      whitelist: true,
    }),
  );

  app.enableCors({ origin: '*' });

  app.setGlobalPrefix('api');

  const port = configService.get<number>('APP_PORT') || 80;
  await app.listen(port, () => {
    Logger.log(
      `Listening at http://localhost:${process.env.APP_PORT}/${GLOBAL_API_PREFIX}`,
    );
  });
}

bootstrap();
