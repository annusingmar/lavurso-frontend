<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between">
        <div class="text-h6">{{ t("learning.grades") }}</div>
        <q-btn
          color="accent"
          :label="t('learning.marks.lessonGrades')"
          @click="showLessonGradesDialog"
        ></q-btn>
      </div>
      <div class="text-caption">
        {{ t("learning.marks.courseGradesAddDescription") }}
      </div>
    </q-card-section>
    <q-card-section>
      <StudentsMarksList
        v-if="students && students.length > 0"
        :id="journal.content.id"
        :students="students"
        type="course"
        :course="course"
        :editable="!journal.content.archived"
        @refresh-above="getCourseStudents"
      ></StudentsMarksList>
      <div v-else-if="!loading">{{ t("learning.noStudentsInJournal") }}</div>
    </q-card-section>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import JournalGradesDialog from "./JournalGradesDialog.vue";
import StudentsMarksList from "./StudentsMarksList.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  journal: {
    type: Object,
    required: true,
  },
  course: {
    type: Number,
    required: true,
  },
});

const loading = ref(true);
const students = ref([]);
const getCourseStudents = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      "/journals/" + props.journal.content.id + "/marks",
      {
        params: {
          mark_type: "course_grade",
          course: props.course,
        },
      }
    );
    students.value = response.data.students;
    loading.value = false;
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("dataLoadingFail"),
      timeout: 0,
      actions: [{ label: t("dismiss"), color: "white" }],
    });
  }
};

const showLessonGradesDialog = () => {
  $q.dialog({
    component: JournalGradesDialog,
    componentProps: {
      id: props.journal.content.id,
      type: "lesson",
      course: props.course,
    },
  });
};

watch(props, getCourseStudents, { immediate: true });
</script>
