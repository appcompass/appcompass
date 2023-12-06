<script setup lang="ts">
import { onBeforeMount, ref } from 'vue';

import { useNotifications } from '@/services/notifications.service';

const notificationsService = useNotifications();

const notificationsIsOpen = ref(false);
const notificationsCount = ref(0);
const notifications = ref({});

const groupToggleState = ref<Record<string, boolean>>({});

const toggleGroup = (group: string) => {
  groupToggleState.value[group] = !groupToggleState.value[group];
};

const isGroupOpen = (group: string) => {
  return !!groupToggleState.value[group];
};

const toggleNotifications = () => {
  notificationsService.toggle();
};

onBeforeMount(() => {
  notificationsService.groupsIsOpenState.subscribe((data) => {
    groupToggleState.value = data;
  });
  notificationsService.userNotifications.subscribe((data) => {
    notifications.value = data;
    notificationsCount.value = notificationsService.count;
  });
  notificationsService.isOpenState.subscribe((isOpen) => (notificationsIsOpen.value = isOpen));

  notificationsService.getNotifications();
});
</script>

<template lang="pug">
div.notifications-panel(
  v-if="notificationsCount",
  :class="{'is-active': notificationsIsOpen}"
)
  div.notifications-header
    h3.notifications-heading Notifications
    a.notifications-close(
      @click="toggleNotifications()"
    )
      span.icon.icon-cancel
    form.notifications-search
      div.search-input
        span.icon-search
        input(type="search")

  div.notifications-category(
    v-for="(group, name) in notifications",
    :class="{'is-active': isGroupOpen(name)}"
  )
    h4.notifications-category-header
      | {{name}}
      span.notifications-category-count(v-text="group.items.length")
      span.notifications-category-toggle(
        v-on:click="toggleGroup(name)"
      )
    div.notifications-content
      div.notifications-item(
        v-for="row in group.items"
      )
        h5.notifications-item-type(v-text="row.type")
        time.notifications-item-time(v-moment-ago="row.time")
        p.notifications-item-message(v-text="row.message")
</template>

<style scoped></style>
