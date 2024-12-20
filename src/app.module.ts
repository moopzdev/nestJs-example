import { MiddlewareConsumer, Module, ValidationPipe } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { ReportsModule } from './reports/reports.module';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { User } from './users/users.entity';
// import { Report } from './reports/reports.entity';
import { APP_PIPE } from '@nestjs/core';
import * as cookieParser from 'cookie-parser';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { getDbConfig } from './utils/dbConfig.util';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV}`,
    }),
    UsersModule,
    ReportsModule,
    //NOTE: typeOrm with configService getting values from .env file
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: () =>
        // config: ConfigService
        {
          return getDbConfig();
        },
    }),
    // NOTE : plain TypeOrm module without configService
    // TypeOrmModule.forRoot({
    //   type: 'sqlite',
    //   database: 'db.sqlite',
    //   entities: [User, Report],
    //   synchronize: true,
    // }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      //Using global pipe here so it stays with the app module for all envs
      provide: APP_PIPE,
      useValue: new ValidationPipe({
        whitelist: true,
      }),
    },
  ],
})
export class AppModule {
  constructor(private config: ConfigService) {}
  //for middlewares to be used automatically for all envs
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(cookieParser(this.config.get<string>('COOKIE_KEY')))
      .forRoutes('*');
  }
}
