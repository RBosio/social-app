import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: 'mysql',
        port: configService.get<number>('MYSQL_PORT'),
        url: configService.get<string>('MYSQL_URI'),
        entities: [],
        synchronize: configService.get<boolean>('MYSQL_SYNCHRONIZE'),
      }),
      inject: [ConfigService],
    }),
  ],
})
export class MysqlModule {}
