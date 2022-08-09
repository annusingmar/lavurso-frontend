<template>
  <q-item clickable v-ripple :to="'/teacher/lessons/' + lesson.id">
    <q-item-section>
      <q-item-label>{{ lessonDate }}</q-item-label>
      <q-item-label caption lines="1" v-if="!isDescriptionEmpty">{{
        lesson.description
      }}</q-item-label>
      <q-item-label caption v-else>No description</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from "vue";
import { date } from "quasar";

const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});

const lessonDate = computed(() => {
  const jsDate = new Date(props.lesson.date);
  return date.formatDate(jsDate, "DD MMMM YYYY");
});

const isDescriptionEmpty = computed(
  () => props.lesson.description.trim() === ""
);
</script>
