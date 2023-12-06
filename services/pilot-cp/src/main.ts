import 'tingle.js/dist/tingle.min.css';
import '@/assets/sass/app.scss';

import { createApp } from 'vue';

import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';
import { initAuthenticationService } from './services/authentication.service';
import { initAuthorizationService } from './services/authorization.service';
import { initNotificationsService } from './services/notifications.service';
import { initUsersService } from './services/users.service';
import { fetchConfig } from './utils/config';
import { momentAgoDirective } from './utils/datetime';

const app = createApp(App);

app.directive('moment-ago', momentAgoDirective());

fetchConfig()
  .setConfig()
  .then((config) => {
    app.provide('appConfig', config);
    const authenticationService = initAuthenticationService();
    app.provide('authenticationService', authenticationService);

    const usersService = initUsersService();
    app.provide('usersService', usersService);

    const authorizationService = initAuthorizationService();
    app.provide('authorizationService', authorizationService);

    const notificationsService = initNotificationsService();
    app.provide('notificationsService', notificationsService);

    authenticationService.refreshToken(() => app.use(router).use(createPinia()).mount('#app'));
  });
