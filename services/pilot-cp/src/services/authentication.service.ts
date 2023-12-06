import type { AxiosError } from 'axios';
import { BehaviorSubject, of, Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, filter, map } from 'rxjs/operators';

import type { UserLoginResponse } from '@/types';
import { Axios } from '@/utils/axios-observable';

let refreshTokenTimeout: NodeJS.Timeout;

export let authenticationService: AuthenticationService;

export const initAuthenticationService = (): AuthenticationService =>
  (authenticationService = new AuthenticationService());

export const useAuthentication = (): AuthenticationService => {
  if (authenticationService) return authenticationService;
  throw new Error('Authentication Service not initialized.');
};

export class AuthenticationService {
  private http: Axios;
  token: BehaviorSubject<string>;

  constructor() {
    this.token = new BehaviorSubject<string>('');
    const baseURL = this.getEnvironmentPath();
    this.http = Axios.create({
      baseURL
    });
    this.token
      .pipe(
        filter((token) => !!token),
        distinctUntilChanged((prev, curr) => prev === curr)
      )
      .subscribe(() => this.startRefreshTokenTimer());
  }

  get isAuthenticated(): boolean {
    return !!this.token.getValue();
  }

  getEnvironmentPath(): string {
    return '/api/authentication';
  }

  login(email: string, password: string, onSuccess?: () => void, onError?: (err?: AxiosError) => void) {
    return this.http
      .post<UserLoginResponse>('/v1/login', { email, password }, { withCredentials: true })
      .pipe(
        map(({ data: { accessToken } }) => this.token.next(accessToken)),
        map(() => onSuccess && onSuccess()),
        catchError((err) => (onError && onError(err)) || err)
      )
      .subscribe();
  }

  logout(): void {
    this.http
      .get('/v1/logout')
      .pipe(map(() => this.reset()))
      .subscribe();
  }

  reset() {
    this.stopRefreshTokenTimer();
    this.token.next('');
  }

  parseToken() {
    const base64Url = this.token.getValue().split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );

    return JSON.parse(jsonPayload);
  }

  refreshToken(cb?: (err?: AxiosError) => void): Subscription {
    return this.http
      .get<UserLoginResponse>('/v1/refresh', { withCredentials: true })
      .pipe(
        map(({ data: { accessToken } }) => accessToken),
        filter((accessToken) => !!accessToken),
        distinctUntilChanged((prev, curr) => prev === curr),
        map((accessToken) => this.token.next(accessToken)),
        map(() => {
          this.startRefreshTokenTimer();
          if (cb) cb();
        }),
        catchError((err) => (this.reset(), of(cb && cb(err))))
      )
      .subscribe();
  }

  startRefreshTokenTimer(): void {
    const decodedToken = this.parseToken();
    if (decodedToken.exp) {
      const expires = new Date(decodedToken.exp * 1000);
      const timeout = expires.getTime() - Date.now() - 60 * 1000;
      refreshTokenTimeout = setTimeout(() => this.refreshToken(), timeout);
    }
  }

  stopRefreshTokenTimer(): void {
    clearTimeout(refreshTokenTimeout);
  }
}
