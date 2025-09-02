import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validationFn } from './config/environment-variables';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: validationFn,
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
