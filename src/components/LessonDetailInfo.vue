<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between q-gutter-sm">
        <div class="text-h5 text-weight-medium">{{ lessonDate }}</div>
        <q-btn
          color="primary"
          :label="t('learning.lessons.editLesson')"
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
      <div v-else class="text-subtitle1 text-italic">
        {{ t("learning.noDescription") }}
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from "vue";
import { date, useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import LessonDialog from "./LessonDialog.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["refreshLesson"]);

const lessonDate = computed(() => {
  return date.formatDate(
    new Date(props.lesson.date),
    "DD MMMM YYYY",
    $q.lang.date
  );
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
