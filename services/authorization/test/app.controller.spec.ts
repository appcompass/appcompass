import { AppService } from '@appcompass/common';
import { ConsoleLogger } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';

import { AppController } from '../src/app.controller';
import { AppServiceMock } from './app.service.mock';

const getAppController = async () => {
  const AppServiceProvider = {
    provide: AppService,
    useClass: AppServiceMock
  };
  const module: TestingModule = await Test.createTestingModule({
    controllers: [AppController],
    providers: [AppServiceProvider, ConsoleLogger]
  }).compile();

  return module.get<AppController>(AppController);
};

describe('AppController', () => {
  describe('status', () => {
    it('should return proper status response', async () => {
      const appController = await getAppController();

      expect(appController.getServiceStatus()).toEqual({
        gitHash: 'testGitHash',
        serviceInstance: 0,
        serviceName: 'testServiceName',
        version: 'testVersion'
      });
    });
  });
});
