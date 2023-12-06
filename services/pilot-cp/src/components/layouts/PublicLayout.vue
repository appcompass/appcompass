<script setup lang="ts">
import { inject, onBeforeMount, ref } from 'vue';

import SiteFooter from '@/components/global/SiteFooter.vue';
import { Config } from '@/utils/config';

const appConfig = inject<Config>('appConfig');
const logoUrl = ref('');

onBeforeMount(() => {
  const headerLogoUrl = appConfig?.get('LOGIN_LOGO_URL');
  if (headerLogoUrl) {
    logoUrl.value = headerLogoUrl;
  }
});
</script>

<template lang="pug">
.site-logout
  .logout-container
    .logout-logo
      img(:src="logoUrl" width="100")
    slot(name="default")
    SiteFooter
</template>

<style scoped>
.site-logout:deep() footer.footer {
  width: 100%;
  border: none;
}
.site-logout:deep() footer.footer .columns {
  clear: both;
  width: 100%;
  text-align: center;
}
</style>
