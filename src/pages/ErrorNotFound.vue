<template>
  <div class="fullscreen bg-blue text-white text-center row flex-center">
    <div class="q-gutter-y-lg">
      <div class="text-h1">404</div>

      <div class="text-h2">Not Found</div>

      <q-btn
        color="white"
        text-color="blue"
        label="Go Back"
        no-caps
        @click="router.go(-1)"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
const router = useRouter();
</script>
