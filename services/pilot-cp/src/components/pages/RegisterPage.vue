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

const register = async () => {
  const authenticationService = useAuthentication();

  // authenticationService.login(
  //   email.value,
  //   password.value,
  //   () => router.push({ name: 'home' }),
  //   (err) => {
  //     error.value = true;
  //     response.value = err?.response?.data;
  //   }
  // );
};
</script>

<template lang="pug">
PublicLayout
  div
    .logout-box
      p Please enter the following information to register your account.
      form
        label(for='') First Name
        input(type='text')
        label(for='') Last Name
        input(type='text')
        label(for='') Email
        input(type='email')
        label(for='') Phone
        input(type='text')
        label(for='') Password
        input(type='password')
        label(for='') Confirm Password
        input(type='password')
        button.btn-primary(@click.prevent="register") Register
    RouterLink.link-text-tertiary.link-icon(
      :to="{name: 'login'}",
    )
      span.icon-arrow-back
      |  Back to Log In
</template>

<style scoped></style>
