<template>
  <div class="fullscreen bg-blue text-white text-center row flex-center">
    <div class="q-gutter-y-lg">
      <div class="text-h1">404</div>

      <div class="text-h2">{{ t("pageNotFound") }}</div>

      <q-btn
        color="white"
        text-color="blue"
        :label="t('goBack')"
        @click="router.go(-1)"
      />
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
const router = useRouter();
const { t } = useI18n({ useScope: "global" });
</script>
