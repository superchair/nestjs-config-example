import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { validateSync } from 'class-validator';
import { plainToInstance } from 'class-transformer';
import { EnvironmentVariables } from './config/EnvironmentVariables';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (config: Record<string, unknown>): EnvironmentVariables => {
        const validateConfig = plainToInstance(EnvironmentVariables, config, {
          enableImplicitConversion: false,
        });

        const errors = validateSync(validateConfig, {
          skipMissingProperties: false,
        });

        if (errors.length > 0) {
          throw new Error(errors.toString());
        }

        return validateConfig;
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
