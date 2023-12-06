import type { AxiosError, AxiosResponse } from 'axios';

import type { ApiError } from '@/types/error';
import { Axios } from '@/utils/axios-observable';

import { authenticationService } from '../services/authentication.service';

export abstract class AuthenticatedService {
  http: Axios;
  constructor() {
    const baseURL = this.getEnvironmentPath();
    this.http = Axios.create({
      baseURL
    });
    this.setRequestInterceptors();
  }

  abstract getEnvironmentPath(): string;

  setRequestInterceptors(): void {
    this.http.interceptors.request.use(
      (config) => {
        config.headers['Authorization'] = `Bearer ${authenticationService.token.getValue()}`;
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.http.interceptors.response.use(
      (response: AxiosResponse) => {
        return response;
      },
      (error: AxiosError<ApiError>) => {
        if (error.response && error.response.data.statusCode === 401) authenticationService.logout();
        return Promise.reject(error);
      }
    );
  }
}
