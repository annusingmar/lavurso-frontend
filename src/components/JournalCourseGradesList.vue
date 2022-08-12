<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between">
        <div class="text-h6">Grades</div>
        <q-btn
          v-if="!loading"
          color="accent"
          label="lesson grades"
          @click="showLessonGradesDialog"
        ></q-btn>
      </div>
      <div class="text-caption">
        Here you can add grades to students for the current course.
      </div>
    </q-card-section>
    <q-card-section v-if="!loading">
      <StudentsMarksList
        :id="journal.content.id"
        :students="students"
        type="course"
        :course="course"
        :editable="!journal.content.archived"
        @refresh-above="getCourseStudents"
      ></StudentsMarksList>
    </q-card-section>
  </q-card>
  <q-inner-loading :showing="loading"></q-inner-loading>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, watch } from "vue";
import JournalGradesDialog from "./JournalGradesDialog.vue";
import StudentsMarksList from "./StudentsMarksList.vue";

const $q = useQuasar();
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
      "/journals/" + props.journal.content.id + "/grades",
      {
        params: {
          grade_type: "course_grade",
          course: props.course,
        },
      }
    );
    students.value = response.data.students;
    loading.value = false;
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
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
