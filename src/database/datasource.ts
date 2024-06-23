import { registerAs } from '@nestjs/config';
import { DataSource, DataSourceOptions } from 'typeorm';
import path from 'path';

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config({ path: path.join(__dirname, '../../.env.development') });

const config = {
  type: 'postgres',
  host: `${process.env.POSTGRES_HOST}`,
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5001,
  username: `${process.env.POSTGRES_USER}`,
  password: `${process.env.POSTGRES_PASSWORD}`,
  database: `${process.env.POSTGRES_DATABASE}`,
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: ['dist/database/migrations/*{.ts,.js}'],
  autoLoadEntities: true,
  synchronize: false,
};

export default registerAs('typeorm', () => config);
export const dataSource = new DataSource(config as DataSourceOptions);

dataSource
  .initialize()
  .then(() => {
    console.log('Data Source has been initialized');
  })
  .catch((error) => {
    console.error('Error initializing Data Source', error);
  });
