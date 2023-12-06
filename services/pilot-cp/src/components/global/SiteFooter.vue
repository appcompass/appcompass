<script setup lang="ts">
import { computed, inject, ref } from 'vue';

import type { Config } from '@/utils/config';

const debug = ref([]);

const appConfig = inject<Config>('appConfig');

const copyrightText = computed(() => `${new Date().getFullYear()} ${appConfig?.get('COPYRIGHT_TEXT')}`);
const showBuiltWith = computed(() => appConfig?.get('SHOW_BUILT_WITH'));

const colWidthClass = computed(() => {
  const width = showBuiltWith.value ? 6 : 12;
  return `xsmall-${width}`;
});
</script>

<template lang="pug">
footer.footer
  .row
    .xsmall-12.columns
      .footer-company
        .row
          .columns(:class="colWidthClass" v-if="showBuiltWith")
            p
              = "Built with "
              span.icon-heart
              = " using "
              a(href="https://appcompass.com" target="_blank") AppCompass
              | .
          .columns.text-right(:class="colWidthClass")
            p {{ copyrightText }}
      pre.footer-reports(
        v-if="debug.length",
        v-html="debug"
      )

</template>

<style scoped></style>
