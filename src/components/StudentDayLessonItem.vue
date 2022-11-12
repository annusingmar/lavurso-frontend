<template>
  <q-item>
    <q-item-section>
      <q-item-label class="text-weight-bold">{{
        lesson.subject.name
      }}</q-item-label>
      <q-item-label
        v-if="lesson.description.trim() !== ''"
        style="white-space: pre"
        >{{ lesson.description }}</q-item-label
      >
      <q-item-label v-else caption class="text-italic">{{
        t("learning.noDescription")
      }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});
</script>
