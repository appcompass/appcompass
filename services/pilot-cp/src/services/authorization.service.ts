import { BehaviorSubject, map, Subscription } from 'rxjs';

import { AuthenticatedService } from '@/utils/authenticated-service';

export let authorizationService: AuthorizationService;

export const initAuthorizationService = (): AuthorizationService => (authorizationService = new AuthorizationService());

export const useAuthorization = (): AuthorizationService => {
  if (authorizationService) return authorizationService;
  throw new Error('Authorization Service not initialized.');
};

export class AuthorizationService extends AuthenticatedService {
  userPermissions: BehaviorSubject<string[]>;

  getEnvironmentPath(): string {
    return '/api/authorization';
  }

  constructor() {
    super();
    this.userPermissions = new BehaviorSubject<string[]>([]);
  }

  routes = {
    myPermissions: (): string => `/v1/my-authorization/permissions`
  };

  get permissions(): string[] {
    return this.userPermissions.getValue();
  }

  getMyPermissions(): Subscription {
    return this.http
      .get<string[]>(this.routes.myPermissions())
      .pipe(map(({ data: permissions }) => this.userPermissions.next(permissions)))
      .subscribe();
  }
}
