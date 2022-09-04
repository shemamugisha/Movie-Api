import { INestApplication, UnauthorizedException } from '@nestjs/common';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import AppConfig from '../interfaces/app-config.interface';
import testingTypeOrmConfig from './test.typeorm.config';
import typeOrmConfig from './typeorm.config';
import 'dotenv/config';

export const commonConfig = (): AppConfig => ({
  port: parseInt(process.env.PORT),
  env: process.env.NODE_ENV,
  url: process.env.API_URL,
  defaultPassword: process.env.DEFAULT_PASSWORD,
  cron_expression: process.env.CRON_EXPRESSION,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN,
  },
  tmdb: {
    apiKey: process.env.TMDB_API_KEY,
    url: process.env.TMDB_URL,
  },
});

export const runtimeConfig = (): AppConfig => {
  console.log('##################');
  console.log('##################');
  console.log('##################');
  console.log('##################');
  console.log('##################');
  console.log(process.env.NODE_ENV);
  return {
    allowedOrigins: process.env.ALLOWED_ORIGINS.split(','),
    database:
      process.env.NODE_ENV === 'test' ? testingTypeOrmConfig : typeOrmConfig,
    ...commonConfig(),
  };
};

export const testingConfig = (): AppConfig => ({
  ...commonConfig(),
});

/**
 * Configures and binds Swagger with the project's application
 * @param app The NestJS Application instance
 */
export function configureSwagger(app: INestApplication): void {
  const API_TITLE = 'Movies API';
  const API_DESCRIPTION = 'API Doc. for Movies API';
  const API_VERSION = '1.0';
  const SWAGGER_URL = 'docs/swagger-ui';
  const options = new DocumentBuilder()
    .setTitle(API_TITLE)
    .setDescription(API_DESCRIPTION)
    .setVersion(API_VERSION)
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup(SWAGGER_URL, app, document, {
    customSiteTitle: 'Movies API',
    swaggerOptions: { docExpansion: 'none', persistAuthorization: true },
  });
}

/**
 * Generates obj for the app's CORS configurations
 * @returns CORS configurations
 */
export function corsConfig(): CorsOptions {
  return {
    allowedHeaders:
      'Origin, X-Requested-With, Content-Type, Accept, Authorization, Set-Cookie, Cookies',
    credentials: true,
    origin: (origin, callback) => {
      const appConfigs = runtimeConfig();
      const whitelist = appConfigs.allowedOrigins || [];
      const canAllowUndefinedOrigin =
        origin === undefined && appConfigs.env !== 'production';

      if (whitelist.indexOf(origin) !== -1 || canAllowUndefinedOrigin) {
        callback(null, true);
      } else {
        callback(
          new UnauthorizedException(
            `Not allowed by CORS for origin:${origin} on ${appConfigs.env}`,
          ),
        );
      }
    },
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  };
}
