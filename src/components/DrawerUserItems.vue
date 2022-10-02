<template>
  <DrawerListItem
    :title="t('sidebar.user.profile')"
    icon="account_circle"
    to="/profile"
  ></DrawerListItem>
  <DrawerListItem
    :title="t('sidebar.user.messages')"
    icon="chat"
    to="/messages"
    :separator="true"
    :red-badge="unread"
  ></DrawerListItem>
</template>

<script setup>
import DrawerListItem from "./DrawerListItem.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

defineProps({
  unread: {
    type: Boolean,
    required: true,
  },
});
</script>
