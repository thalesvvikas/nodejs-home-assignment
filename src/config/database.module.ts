import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from '../users/user.model';
import { Task } from '../tasks/task.model';

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        ...configService.get('database'),
        models: [User, Task],
        autoLoadModels: true,
        synchronize: true, // Be cautious with this in production
      }),
      inject: [ConfigService],
    }),
  ],
})
export class DatabaseModule {}