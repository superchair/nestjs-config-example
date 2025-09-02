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
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { ConfigService } from '@nestjs/config';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;
  let mockConfigService: ConfigService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    })
      .overrideProvider(ConfigService)
      .useClass(MockConfigService)
      .compile();

    mockConfigService = moduleFixture.get<ConfigService>(ConfigService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  afterEach(async () => {
    delete process.env.VAL_TRUE;
    delete process.env.VAL_FALSE;
    if (app) {
      await app.close();
    }
  });

  it('/get-true (GET)', () => {
    return request(app.getHttpServer())
      .get('/get-true')
      .expect(200)
      .expect('true');
  });

  it('/get-true (GET) will return false unexpectedly', () => {
    mockConfigService.get = jest.fn((key: string) => {
      if (key === 'VAL_TRUE') return 'false';
    });

    return request(app.getHttpServer())
      .get('/get-true')
      .expect(200)
      .expect('false');
  });
});
