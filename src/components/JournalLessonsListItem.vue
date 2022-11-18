<template>
  <q-item v-ripple clickable :to="'/teacher/lessons/' + lesson.id">
    <q-item-section>
      <q-item-label>{{ lessonDate }}</q-item-label>
      <q-item-label v-if="!isDescriptionEmpty" caption lines="1">{{
        lesson.description
      }}</q-item-label>
      <q-item-label v-else caption class="text-italic">{{
        t("learning.noDescription")
      }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from "vue";
import { date, useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});

const lessonDate = computed(() => {
  const jsDate = new Date(props.lesson.date);
  return date.formatDate(jsDate, "DD. MMMM YYYY", $q.lang.date);
});

const isDescriptionEmpty = computed(
  () => props.lesson.description.trim() === ""
);
</script>
