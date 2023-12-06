<script setup lang="ts">
import { inject, onBeforeMount, ref } from 'vue';

import HeaderLeftNavigation from '@/components/global/HeaderLeftNavigation.vue';
import HeaderRightNavigation from '@/components/global/HeaderRightNavigation.vue';
import { Config } from '@/utils/config';

const appConfig = inject<Config>('appConfig');
const logoUrl = ref('');

onBeforeMount(() => {
  const headerLogoUrl = appConfig?.get('HEADER_LOGO_URL');
  if (headerLogoUrl) {
    logoUrl.value = headerLogoUrl;
  }
});
</script>

<template lang="pug">
header.header
  div.header-logo
    router-link(to="/")
      img(:src="logoUrl", width="26", height="34")
  nav.header-nav-container
    HeaderLeftNavigation
    HeaderRightNavigation

</template>

<style scoped></style>
