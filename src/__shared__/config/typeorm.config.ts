import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import 'dotenv/config';
import { isRunningInProduction } from '../utils/env.util';

const typeOrmConfig: TypeOrmModuleOptions = {
  host: process.env.POSTGRES_HOST,
  port: parseInt(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  type: 'postgres',
  synchronize: true,
  dropSchema: false,
  keepConnectionAlive: true,
  logging: !isRunningInProduction(),
  entities: ['dist/**/*.entity.js'],
  autoLoadEntities: true,
  migrationsTableName: 'migrations',
  migrations: ['dist/db/migrations/*{.ts,.js}'],
  cli: { migrationsDir: 'src/db/migrations' },
  migrationsRun: false,
};

export default typeOrmConfig;
