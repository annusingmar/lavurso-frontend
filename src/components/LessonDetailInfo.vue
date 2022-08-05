<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between">
        <div class="text-h4">Lesson</div>
        <q-btn color="primary" label="edit lesson"></q-btn>
      </div>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section>
      <div class="row justify-between">
        <div class="text-h4">{{ lessonDate }}</div>
        <div class="text-h6 text-weight-regular">{{ lesson.journal.name }}</div>
      </div>
      <div>
        <div class="text-subtitle1" v-if="!isDescriptionEmpty">
          {{ lesson.description }}
        </div>
        <div class="text-caption" v-else>No description for lesson</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from "vue";
import { date } from "quasar";

const props = defineProps(["lesson"]);

const lessonDate = computed(() => {
  const jsDate = new Date(props.lesson.date);
  return date.formatDate(jsDate, "DD MMMM YYYY");
});

const isDescriptionEmpty = computed(
  () => props.lesson.description.trim() === ""
);
</script>
