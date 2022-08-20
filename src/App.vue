<template>
  <router-view />
</template>

<script setup>
import { useUserStore } from "./stores/user";

const store = useUserStore();
store.tryLogin();
</script>
