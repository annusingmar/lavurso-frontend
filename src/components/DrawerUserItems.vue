<template>
  <DrawerListItem
    title="Account"
    icon="settings"
    to="/account"
  ></DrawerListItem>
  <DrawerListItem
    title="Messages"
    icon="chat"
    to="/messages"
    :separator="true"
  ></DrawerListItem>
</template>

<script setup>
import DrawerListItem from "./DrawerListItem.vue";
</script>
