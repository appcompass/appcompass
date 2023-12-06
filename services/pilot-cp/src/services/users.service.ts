// import { AxiosError } from 'axios';
import { BehaviorSubject, map, Subscription } from 'rxjs';

// import { catchError, map, mergeMap } from 'rxjs/operators';
import { UserProfile } from '@/dtos';
import { AuthenticatedService } from '@/utils/authenticated-service';

export let usersService: UsersService;

export const initUsersService = (): UsersService => (usersService = new UsersService());

export const useUsers = (): UsersService => {
  if (usersService) return usersService;
  throw new Error('Users Service not initialized.');
};

export class UsersService extends AuthenticatedService {
  userProfile: BehaviorSubject<UserProfile>;

  getEnvironmentPath(): string {
    return '/api/users';
  }

  constructor() {
    super();
    this.userProfile = new BehaviorSubject<UserProfile>(new UserProfile());
  }

  routes = {
    register: (): string => `/v1/register`,
    confirmRegistration: (): string => `/v1/confirm-registration`,
    forgotPassword: (): string => `/v1/forgot-password`,
    resetPassword: (): string => `/v1/reset-password`,
    profile: (): string => `/v1/profile`,
    users: (): string => `/v1/users`,
    user: (userId: number): string => `/v1/users/${userId}`
  };

  get profile(): UserProfile {
    return this.userProfile.getValue();
  }

  getProfile(): Subscription {
    return this.http
      .get<UserProfile>(this.routes.profile())
      .pipe(map(({ data: profile }) => this.userProfile.next(profile)))
      .subscribe();
  }
}
