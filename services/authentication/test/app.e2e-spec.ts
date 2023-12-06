import * as request from 'supertest';

import { AppService } from '@appcompass/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '../src/app.controller';
import { AppServiceMock } from './app.service.mock';

// TODO: Update to mock backend services, not app functionality.
describe('AppController (e2e)', () => {
  let app;

  beforeEach(async () => {
    const AppServiceProvider = {
      provide: AppService,
      useClass: AppServiceMock
    };
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppServiceProvider]
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/status (GET)', () =>
    request(app.getHttpServer()).get('/status').expect(200).expect({
      gitHash: 'testGitHash',
      serviceInstance: 0,
      serviceName: 'testServiceName',
      version: 'testVersion'
    }));
});
