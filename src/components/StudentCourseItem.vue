<template>
  <div class="row items-center q-gutter-x-sm">
    <div class="col-shrink">
      <div
        v-if="course > 0"
        style="cursor: pointer"
        class="text-teal-8"
        @click="courseLessonsDialog"
      >
        {{ course }}. {{ t("learning.course") }}
      </div>
      <div v-else>{{ t("learning.summary") }}</div>
    </div>
    <div class="col-grow row justify-between">
      <div class="row q-gutter-x-sm">
        <MarkIcon
          v-for="mark in lessonMarks"
          :key="mark.id"
          :extra-info="true"
          :mark="mark"
          @refresh-above="emit('refreshAbove')"
        ></MarkIcon>
      </div>
      <div class="row q-gutter-x-sm">
        <MarkIcon
          v-for="mark in summaryMarks"
          :key="mark.id"
          :extra-info="true"
          :mark="mark"
        ></MarkIcon>
      </div>
    </div>
  </div>
  <q-separator spaced="sm"></q-separator>
</template>

<script setup>
import { useQuasar } from "quasar";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import StudentCourseLessonsDialog from "./StudentCourseLessonsDialog.vue";
import MarkIcon from "./MarkIcon.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  journalId: {
    type: Number,
    required: true,
  },
  course: {
    type: Number,
    required: true,
  },
  studentId: {
    type: Number,
    required: true,
  },
  marks: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["refreshAbove"]);

const summaryMarks = computed(() =>
  props.marks.filter((m) => {
    return !m.lesson || !m.lesson.id;
  })
);
const lessonMarks = computed(() =>
  props.marks.filter((m) => {
    return m.lesson && m.lesson.id;
  })
);

const courseLessonsDialog = () => {
  $q.dialog({
    component: StudentCourseLessonsDialog,
    componentProps: {
      journalId: props.journalId,
      course: props.course,
      studentId: props.studentId,
    },
  });
};
</script>
