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
      p Please enter a new password.
      form(v-on:submit.prevent="resetPassword")
        label(for='email') Email Address
        input(type="email", placeholder="Email", :class="{'error': error && response.email}", v-model="email")
        ul.form-error(v-if="error")
          li(v-if="response.email", v-for="line in response.email") {{line}}
        label(for='password') New Password
        input(type="password", name="password", placeholder="Password", :class="{'error': error && response.password}", v-model="password")
        ul.form-error(v-if="error")
          li(v-if="response.password", v-for="line in response.password") {{line}}
        label(for='password_confirmation') Confirm New Password
        input(type="password", name="password_confirmation", placeholder="Confirm Password", :class="{'error': error && response.password_confirmation}", v-model="password_confirmation")
        ul.form-error(v-if="error")
          li(v-if="response.password_confirmation", v-for="line in response.password_confirmation") {{line}}

        div(v-if="error")
          label(v-if="response.token", v-for="line in response.token")
            span.required {{line}}
      .align-space-between
        button.btn-primary(@click.prevent="resetPassword") Reset Password
        router-link.link-text-tertiary.link-icon(:to="{name: 'login'}")
          span.icon-arrow-back
          | Back to Log In
</template>

<style scoped></style>
