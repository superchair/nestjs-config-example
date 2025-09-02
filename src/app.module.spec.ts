interface ConfigModuleInterface {
  ConfigModule: {
    forRoot: (options?: Record<string, unknown>) => Record<string, unknown>;
  };
}

jest.mock('@nestjs/config', () => {
  const actual: ConfigModuleInterface = jest.requireActual('@nestjs/config');

  return {
    ...actual,
    ConfigModule: {
      forRoot: jest.fn((options?: Record<string, unknown>) => {
        return actual.ConfigModule.forRoot({
          ...options,
          validate: undefined, // override
          ignoreEnvFile: true, // override
          validatePredefined: false, // override
        });
      }),
    },
  };
});

const MockConfigService = jest.fn().mockImplementation(() => {
  return {
    get: jest.fn((key: string) => {
      if (key === 'VAL_TRUE') {
        return 'true';
      }
      if (key === 'VAL_FALSE') {
        return 'false';
      }
      return null;
    }),
  };
});

import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useClass(MockConfigService)
      .compile();
  });

  it('should have AppController as a controller', () => {
    const controllers = module.get(AppController);
    expect(controllers).toBeInstanceOf(AppController);
  });

  it('should have AppService as a provider', () => {
    const appService = module.get(AppService);
    expect(appService).toBeInstanceOf(AppService);
  });
});
