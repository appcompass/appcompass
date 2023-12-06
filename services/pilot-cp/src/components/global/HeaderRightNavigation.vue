<script setup lang="ts">
import { computed, onBeforeMount, ref } from 'vue';

import { useRouter } from 'vue-router';

import { useAuthentication } from '@/services/authentication.service';
import { useNotifications } from '@/services/notifications.service';
import { useUsers } from '@/services/users.service';
import { URLS } from '@/utils/constants';

const router = useRouter();
const authenticationService = useAuthentication();
const usersService = useUsers();
const notificationsService = useNotifications();

const authenticated = computed(() => authenticationService.isAuthenticated);

const user = computed(() => usersService.profile);
const user_id = computed(() => user.value.id);
const gravatarUrl = computed(() => `${user.value.gravatarUrl}?s=40`);
const navigation = computed(() => [
  {
    title: 'Profile',
    url: URLS.PROFILE
  }
]);

const company = computed(() => {
  return {
    available: [
      {
        id: 1,
        name: 'Company 1',
        available: true
      },
      {
        id: 2,
        name: 'Company 2',
        available: false
      }
    ],
    current: {
      id: 1,
      name: 'Company 1'
    }
  };
});

const notificationsIsOpen = ref(false);
const notificationsCount = ref(0);

const logout = () => {
  authenticationService.logout();
  router.push({ name: 'login' });
};

const toggleNotifications = () => {
  notificationsService.toggle();
};

onBeforeMount(() => {
  notificationsService.userNotifications.subscribe(() => {
    notificationsCount.value = notificationsService.count;
  });
  notificationsService.isOpenState.subscribe((isOpen) => (notificationsIsOpen.value = isOpen));
});
</script>

<template lang="pug">
ul.header-nav.header-nav-secondary(v-if="authenticated")
  li
    div.header-search
      div.search-input
        span.icon-search
        input(type="search")
  li
    a
      span.header-profile
        img(:src="gravatarUrl")
    ul
      li(v-for="cat in navigation")
        router-link(:to="cat.url" exact, :params="{current_user_id: user_id}", v-if="cat.url") {{ cat.title }}
      div(v-for="comp in company.available")
        template(v-if="company.available")
          li(v-if="comp.id != company.current.id")
            a(href="#", @click="setCompany(comp.id)")
              small {{ comp.name }}
      li
        a(@click.prevent="logout()") Logout
  li
    a.notifications-toggle(
      @click="toggleNotifications()",
      :class="{'is-active': notificationsIsOpen}"
    )
      span.header-notifications.icon-notification
        span.alert-count(v-text="notificationsCount")

</template>

<style scoped></style>
