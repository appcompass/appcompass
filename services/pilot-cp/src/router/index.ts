import { inject } from 'vue';

import { createRouter, createWebHistory } from 'vue-router';

import type { AuthenticationService } from '@/services/authentication.service';
import type { Config } from '@/utils/config';
import { URLS } from '@/utils/constants';
import { useTitle } from '@vueuse/core';

const pageTitleDelimiter = ' | ';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    // Public Routes
    {
      path: URLS.LOGIN,
      name: 'login',
      meta: {
        title: 'Login'
      },
      component: () => import('@/components/pages/LoginPage.vue')
    },
    {
      path: URLS.REGISTER,
      name: 'register',
      meta: {
        title: 'Register'
      },
      component: () => import('@/components/pages/RegisterPage.vue')
    },
    {
      path: URLS.REQUEST_PASSWORD_RESET,
      name: 'request-password-reset',
      meta: {
        title: 'Request Password Reset'
      },
      component: () => import('@/components/pages/PasswordEmailPage.vue')
    },
    {
      path: URLS.RESET_PASSWORD,
      name: 'password-reset',
      meta: {
        title: 'Password Reset'
      },
      component: () => import('@/components/pages/PasswordResetPage.vue')
    },
    // Private Routes
    {
      path: '/',
      name: 'home',
      meta: {
        requiresAuth: true,
        title: 'Home'
      },
      component: () => import('@/components/pages/HomePage.vue')
    },
    {
      path: URLS.PROFILE,
      name: 'profile',
      meta: {
        requiresAuth: true,
        title: 'Profile'
      },
      component: () => import('@/components/pages/ProfilePage.vue')
    }
  ]
});

router.beforeEach(async (to, from, next) => {
  // handle page title
  const titleParts = [];
  const appConfig = inject<Config>('appConfig');
  if (appConfig) titleParts.push(appConfig.get('APP_TITLE'));
  if (to.meta?.title) titleParts.push(to.meta.title);

  const title = titleParts.reverse().join(pageTitleDelimiter);

  useTitle(title);

  // handle auth check
  if (to.meta?.requiresAuth) {
    const authenticationService = inject<AuthenticationService>('authenticationService');
    if (authenticationService && authenticationService.isAuthenticated) {
      next();
    } else {
      next({ name: 'login' });
    }
  } else {
    next();
  }
});

export default router;
