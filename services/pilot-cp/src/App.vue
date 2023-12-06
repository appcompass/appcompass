<script setup lang="ts">
import { onBeforeMount } from 'vue';

import { distinctUntilChanged, filter } from 'rxjs/operators';
import { RouterView } from 'vue-router';

import { useAuthentication } from '@/services/authentication.service';
import { useAuthorization } from '@/services/authorization.service';
import { useUsers } from '@/services/users.service';

const authenticationService = useAuthentication();
const usersService = useUsers();
const authorizationService = useAuthorization();

onBeforeMount(() => {
  authenticationService.token
    .pipe(
      filter((accessToken) => !!accessToken),
      distinctUntilChanged((prev, curr) => prev === curr)
    )
    .subscribe(() => {
      usersService.getProfile();
      authorizationService.getMyPermissions();
    });
});
</script>

<template lang="pug">
#app
  RouterView(v-slot="{ Component }")
    transition(name="fade", mode="out-in")
      Component(:is="Component")
</template>

<style></style>
