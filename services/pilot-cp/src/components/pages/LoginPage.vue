<script setup lang="ts">
import { computed, inject, ref } from 'vue';

import { type AxiosResponse } from 'axios';
import { RouterLink, useRouter } from 'vue-router';

import PublicLayout from '@/components/layouts/PublicLayout.vue';
import { useAuthentication } from '@/services/authentication.service';

const email = ref('');
const password = ref('');
const error = ref(false);
const response = ref<AxiosResponse['data']>({});
const router = useRouter();

const login = async () => {
  const authenticationService = useAuthentication();
  authenticationService.login(
    email.value,
    password.value,
    () => router.push({ name: 'home' }),
    (err) => {
      error.value = true;
      response.value = err?.response?.data;
    }
  );
};
</script>

<template lang="pug">
PublicLayout
  .logout-box
    form
      label Email Address
      input(type="email", placeholder="Email", v-model="email", @keydown="error = false", @keyup.enter="login")
      label Password
      input(type="password", placeholder="Password", v-model="password", @keyup.enter="login", @keydown="error = false")
      ul.form-error(v-if="error")
        li {{ response.message }}
      .align-space-between
        button.btn-primary(@click.prevent="login") Log In
        RouterLink.link-text-tertiary(:to="{name: 'request-password-reset'}") Reset Password
    .text-right
      RouterLink.link-text-tertiary.link-icon(:to="{name: 'register'}")
        span.icon-user
        | Register
</template>

<style scoped></style>
