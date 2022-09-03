import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import 'dotenv/config';
import { AppModule } from './app.module';
import { configureSwagger, corsConfig } from './__shared__/config/app.config';
import { isRunningInProduction } from './__shared__/utils/env.util';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const port = configService.get('port');
  app.use(cookieParser());
  app.setGlobalPrefix('api/v1');
  app.enableCors(corsConfig());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  if (!isRunningInProduction()) {
    configureSwagger(app);
  }
  await app.listen(port || 3000);
  Logger.log(`Server running on port ${port}`);
}
bootstrap();
