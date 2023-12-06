import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { Agent } from 'http';
import { snakeCase } from 'lodash/fp';

import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MessagingService {
  private client: AxiosInstance;
  constructor(private readonly configService: ConfigService) {
    const httpAgent = new Agent({ keepAlive: true });
    this.client = axios.create({
      httpAgent
    });
    this.client.defaults.headers.common['X-Requesting-Service'] = this.configService.get('SERVICE_NAME');
    this.client.defaults.headers.common['X-Api-Key'] = this.configService.get('INTERSERVICE_API_KEY');
  }

  async sendAsync<R, I = unknown>(pattern: string, payload: I) {
    try {
      const url = this.getUrl(pattern);
      const { data } = await this.client.post<I, AxiosResponse<R>>(url, payload);
      return data;
    } catch (error: unknown) {
      throw error;
    }
  }

  // TODO: discuss and implement an inter service event system.
  emit<R, I = unknown>(pattern: string, data: I): R | void {
    pattern;
    data;
  }

  private getUrl(pattern: string) {
    const serviceName = snakeCase(pattern.substring(0, pattern.indexOf('.'))).toUpperCase();
    const url = this.configService.get(`${serviceName}_API_URL`);
    return `${url}/${pattern}`;
  }
}
