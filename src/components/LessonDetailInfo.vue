<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between">
        <div class="text-h4">Lesson</div>
        <q-btn
          v-if="!lesson.journal.archived"
          color="primary"
          label="edit lesson"
          @click="lessonEditDialog"
        ></q-btn>
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
  return date.formatDate(jsDate, "DD MMMM YYYY");
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
