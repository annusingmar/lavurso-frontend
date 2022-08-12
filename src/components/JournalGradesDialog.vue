<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 100%">
      <q-card-section>
        <div class="row justify-between">
          <div v-if="type === 'lesson'" class="text-h5">Lesson Grades</div>
          <div v-else-if="type === 'course'" class="text-h5">Course Grades</div>
          <q-btn flat round dense icon="close" @click="cancelClicked"></q-btn>
        </div>
      </q-card-section>
      <q-card-section>
        <StudentsMarksList
          :students="students"
          :editable="false"
          :extra-info="true"
        ></StudentsMarksList>
      </q-card-section>
      <q-inner-loading :showing="loading"></q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import StudentsMarksList from "./StudentsMarksList.vue";

const $q = useQuasar();

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  course: {
    type: Number,
    required: false,
    default: null,
  },
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const cancelClicked = onDialogCancel;

const students = ref([]);
const loading = ref(true);
const getGrades = async () => {
  loading.value = true;

  let params = {};
  if (props.type === "lesson") {
    params.grade_type = "lesson_grade";
    params.course = props.course;
  } else if (props.type === "course") {
    params.grade_type = "course_grade";
  }

  try {
    const response = await api.get("/journals/" + props.id + "/grades", {
      params,
    });
    students.value =
      response.data.students !== null ? response.data.students : [];
    loading.value = false;
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};

getGrades();
</script>
