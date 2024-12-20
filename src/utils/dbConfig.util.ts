import { TypeOrmModuleOptions } from '@nestjs/typeorm';

export function getDbConfig(): TypeOrmModuleOptions {
  const dbConfig: TypeOrmModuleOptions = {};
  switch (process.env.NODE_ENV) {
    case 'development':
      Object.assign(dbConfig, {
        type: 'sqlite',
        database: 'db.sqlite',
        entities: ['**/*.entity.js'],
      });
      break;
    case 'test':
      Object.assign(dbConfig, {
        type: 'sqlite',
        database: 'test.sqlite',
        entities: ['**/*.entity.ts'],
        synchronize: true,
      });
      break;
    case 'production':
      //synchronize must be false
      break;
    default:
      throw new Error('unknown environment');
  }
  return dbConfig;
}
