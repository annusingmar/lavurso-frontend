<template>
  <DrawerListItem
    :title="t('sidebar.user.account')"
    icon="settings"
    to="/account"
  ></DrawerListItem>
  <DrawerListItem
    :title="t('sidebar.user.messages')"
    icon="chat"
    to="/messages"
    :separator="true"
  ></DrawerListItem>
</template>

<script setup>
import DrawerListItem from "./DrawerListItem.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
</script>
