import { firstValueFrom } from 'rxjs';

import { Injectable, OnApplicationBootstrap, OnApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ClientProxy, ClientProxyFactory } from '@nestjs/microservices';

@Injectable()
export class MessagingService implements OnApplicationShutdown, OnApplicationBootstrap {
  private eventsClient: ClientProxy;
  constructor(private readonly configService: ConfigService) {
    this.eventsClient = ClientProxyFactory.create(this.configService.get('INTERSERVICE_TRANSPORT_CONFIG'));
  }

  send<R, I = unknown>(pattern: string, data: I) {
    return this.eventsClient.send<R, I>(pattern, data);
  }

  async sendAsync<R, I = unknown>(pattern: string, data: I) {
    return await firstValueFrom(this.send<R, I>(pattern, data));
  }

  emit<R, I = unknown>(pattern: string, data: I) {
    return this.eventsClient.emit<R, I>(pattern, data);
  }

  async emitAsync<R, I = unknown>(pattern: string, data: I) {
    return await firstValueFrom(this.emit<R, I>(pattern, data));
  }

  async onApplicationBootstrap() {
    await this.eventsClient.connect();
  }

  async onApplicationShutdown() {
    await this.eventsClient.close();
  }
}
