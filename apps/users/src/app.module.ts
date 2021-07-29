import { Module } from '@nestjs/common';

import { ApiModule } from './api/api.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from './config/config.module';
import { DBModule } from './db/db.module';
import { MessagingModule } from './messaging/messaging.module';

@Module({
  imports: [ConfigModule, DBModule, ApiModule, MessagingModule],
  controllers: [AppController],
  providers: [AppService]
})
export class AppModule {}
