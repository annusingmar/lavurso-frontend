<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between q-gutter-sm">
        <div class="text-h5 text-weight-medium">{{ lessonDate }}</div>
        <q-btn
          v-if="!lesson.journal.archived"
          color="primary"
          label="edit lesson"
          @click="lessonEditDialog"
        ></q-btn>
      </div>

      <div class="text-h6 text-weight-regular">{{ lesson.journal.name }}</div>

      <div
        v-if="!isDescriptionEmpty"
        class="text-subtitle1"
        style="white-space: pre"
      >
        {{ lesson.description }}
      </div>
      <div v-else class="text-subtitle1 text-italic">No description</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from "vue";
import { date, useQuasar } from "quasar";
import LessonDialog from "./LessonDialog.vue";

const $q = useQuasar();
const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["refreshLesson"]);

const lessonDate = computed(() => {
  const jsDate = new Date(props.lesson.date);
  return date.formatDate(jsDate, "DD MMMM YYYY", $q.lang.date);
});

const isDescriptionEmpty = computed(
  () => props.lesson.description.trim() === ""
);

const lessonEditDialog = () => {
  $q.dialog({
    component: LessonDialog,
    componentProps: {
      existingLesson: props.lesson,
    },
  }).onOk(() => {
    emit("refreshLesson");
  });
};
</script>
