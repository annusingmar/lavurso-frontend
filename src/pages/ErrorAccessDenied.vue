<template>
  <div class="fullscreen bg-red text-white text-center row flex-center">
    <div class="q-gutter-y-lg">
      <div class="text-h1">403</div>

      <div class="text-h2">Access Denied</div>

      <q-btn
        color="white"
        text-color="red"
        label="Go Back"
        @click="router.go(-1)"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>
