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

const requestReset = async () => {
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
      p Please enter your email address. We will send you a link to create a new password.
      form(v-on:submit.prevent="requestReset")
        label(for='email') Email Address
        input#email(type="email", placeholder="Email", :class="{'error': error}", v-model="email", @keydown="error = false")
        ul.form-error(v-if="error")
          li(v-if="response.email", v-for="line in response.email") {{line}}
      .align-space-between
        button.btn-primary(@click.prevent="requestReset") Reset Password
        router-link.link-text-tertiary.link-icon(:to="{name: 'login'}")
          span.icon-arrow-back
          | Back to Log In
</template>

<style scoped></style>
