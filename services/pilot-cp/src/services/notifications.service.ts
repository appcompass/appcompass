import { BehaviorSubject } from 'rxjs';

import { AuthenticatedService } from '@/utils/authenticated-service';

export let notificationsService: NotificationsService;

export const initNotificationsService = (): NotificationsService => (notificationsService = new NotificationsService());

export const useNotifications = (): NotificationsService => {
  if (notificationsService) return notificationsService;
  throw new Error('Notifications Service not initialized.');
};

export interface Notification {
  type: string;
  time: string;
  message: string;
}

export interface Notifications {
  [key: string]: {
    items: Notification[];
  };
}

// @TODO: delete, temp for demo purposes
function d2(n: number) {
  if (n < 9) return '0' + n;
  return n;
}

// @TODO: delete, temp for demo purposes
function formatDate(date: number) {
  const newDate = new Date(date);
  return (
    newDate.getFullYear() +
    '-' +
    d2(newDate.getMonth() + 1) +
    '-' +
    d2(newDate.getDate()) +
    ' ' +
    d2(newDate.getHours()) +
    ':' +
    d2(newDate.getMinutes()) +
    ':' +
    d2(newDate.getSeconds())
  );
}
const stamp = new Date();

export class NotificationsService extends AuthenticatedService {
  userNotifications: BehaviorSubject<Notifications>;
  isOpenState: BehaviorSubject<boolean>;
  groupsIsOpenState: BehaviorSubject<Record<string, boolean>>;

  getEnvironmentPath(): string {
    return '/api/notifications';
  }

  constructor() {
    super();
    this.userNotifications = new BehaviorSubject<Notifications>({});
    this.isOpenState = new BehaviorSubject<boolean>(false);
    this.groupsIsOpenState = new BehaviorSubject<Record<string, boolean>>({});

    this.userNotifications.subscribe((notifications) => {
      this.groupsIsOpenState.next(
        Object.keys(notifications).reduce<Record<string, boolean>>((acc, curr) => {
          acc[curr] = true;
          return acc;
        }, {})
      );
    });
  }

  routes = {};

  get count(): number {
    return Object.values(this.notifications).reduce((acc, curr) => acc + curr.items.length, 0);
  }

  get notifications(): Notifications {
    return this.userNotifications.getValue();
  }

  get isOpen(): boolean {
    return this.isOpenState.getValue();
  }

  toggle() {
    this.isOpenState.next(!this.isOpen);
  }

  clearNotificaitons() {
    this.userNotifications.next({});
  }

  getNotifications() {
    this.userNotifications.next({
      // @TODO: delete, temp for demo purposes
      users: {
        items: [
          {
            type: 'Logout',
            time: formatDate(stamp.setMinutes(stamp.getMinutes() - 3)),
            message: 'Trinity logged out.'
          },
          {
            type: 'Logout',
            time: formatDate(stamp.setMinutes(stamp.getMinutes() - 3)),
            message: 'Neo logged out.'
          },
          {
            type: 'Login',
            time: formatDate(stamp.setMinutes(stamp.getMinutes() - 3)),
            message: 'Trinity logged in.'
          },
          {
            type: 'Login',
            time: formatDate(stamp.setMinutes(stamp.getMinutes() - 3)),
            message: 'Neo logged in.'
          },
          {
            type: 'Logout',
            time: formatDate(stamp.setMinutes(stamp.getMinutes() - 3)),
            message: 'Agent Smith logged out.'
          }
        ]
      },
      media: {
        items: [
          {
            type: 'Upload',
            time: formatDate(stamp.setMinutes(stamp.getMinutes() - 3)),
            message: 'Neo uploaded 4 photos.'
          },
          {
            type: 'Upload',
            time: formatDate(stamp.setMinutes(stamp.getMinutes() - 3)),
            message: 'Trinity uploaded 5 videos.'
          },
          {
            type: 'Deletion',
            time: formatDate(stamp.setMinutes(stamp.getMinutes() - 3)),
            message: 'Agent Smith deleted 3 photos and 5 videos.'
          }
        ]
      }
    });
  }
}
