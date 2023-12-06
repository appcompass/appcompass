<script setup lang="ts">
import { computed } from 'vue';

import { RouterView } from 'vue-router';

import SideNavigation from '@/components/global/SideNavigation.vue';
import SiteBreadcrumbs from '@/components/global/SiteBreadcrumbs.vue';
import SiteFooter from '@/components/global/SiteFooter.vue';
import SiteHeader from '@/components/global/SiteHeader.vue';
import SiteModal from '@/components/global/SiteModal.vue';
import SiteNotifications from '@/components/global/SiteNotifications.vue';

const hasNav = computed(() => true);
</script>

<template lang="pug">
.site
  SiteHeader
  .content-container
    SideNavigation(v-if="hasNav")
    SiteNotifications
    .main-container
      main.main
        .row
          .xsmall-12.columns
            SiteBreadcrumbs
        .row
          slot
      SiteFooter
  SiteModal
</template>

<style scoped></style>
