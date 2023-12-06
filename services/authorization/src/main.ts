import {
  addSwaggerDocs,
  applyConfigurations,
  applySecurity,
  applyValidators,
  createApp,
  startApp
} from '@appcompass/common';
import { ConfigService } from '@nestjs/config';

import { AppModule } from './app.module';

Error.stackTraceLimit = Infinity;

async function bootstrap() {
  const app = await createApp(AppModule);
  const configService = app.get(ConfigService);
  const serviceName = configService.get('SERVICE_NAME');
  const servicePort = configService.get('SERVICE_PORT');
  const { corsOptions } = configService.get('APP_CONFIG');

  applySecurity(app, corsOptions);
  applyConfigurations(app, serviceName);
  applyValidators(app);
  addSwaggerDocs(
    app,
    'App Compass Authorization Service',
    'A microservice for the App Compass Platform',
    '1.0',
    serviceName,
    `${serviceName}/docs`
  );
  await startApp(app, servicePort);
}

bootstrap();
