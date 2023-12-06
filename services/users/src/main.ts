import {
  addSwaggerDocs,
  applyConfigurations,
  applySecurity,
  applyValidators,
  createApp,
  MessagingService,
  startApp
} from '@appcompass/common';
import { ConsoleLogger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';
import { roles } from './service.data';

Error.stackTraceLimit = Infinity;

async function bootstrap() {
  const app = await createApp(AppModule);
  const configService = app.get(ConfigService);
  const logger = app.get(ConsoleLogger);
  const serviceName = configService.get('SERVICE_NAME');
  const servicePort = configService.get('SERVICE_PORT');
  const { corsOptions } = configService.get('APP_CONFIG');

  applySecurity(app, corsOptions);
  applyConfigurations(app, serviceName);
  applyValidators(app);
  addSwaggerDocs(
    app,
    'App Compass Users Service',
    'A microservice for the App Compass Platform',
    '1.0',
    serviceName,
    `${serviceName}/docs`
  );
  await startApp(app, servicePort);
  try {
    await app.get(MessagingService).sendAsync('authorization.register.roles', { data: roles });
    logger.log('Service Roles registered successfully');
  } catch (error) {
    logger.error(`Service Roles not registered successfully: ${error.message}`);
  }
}

bootstrap();
