import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EnvironmentVariables } from './config/environment-variables';

@Controller()
export class AppController {
  constructor(
    private readonly configService: ConfigService<EnvironmentVariables, true>,
  ) {}

  @Get('/get-true')
  getTrue(): boolean {
    return this.configService.get<boolean>('VAL_TRUE');
  }

  @Get('/get-false')
  getFalse(): boolean {
    return this.configService.get<boolean>('VAL_FALSE');
  }
}
