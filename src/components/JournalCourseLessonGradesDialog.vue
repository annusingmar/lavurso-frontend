<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 100%">
      <q-card-section>
        <div class="row justify-between">
          <div class="text-h5">Lesson Grades</div>
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
  course: {
    type: Number,
    required: true,
  },
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const cancelClicked = onDialogCancel;

const students = ref([]);
const loading = ref(true);
const getLessonGrades = async () => {
  loading.value = true;
  try {
    const response = await api.get("/journals/" + props.id + "/grades", {
      params: {
        grade_type: "lesson_grade",
        course: props.course,
      },
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

getLessonGrades();
</script>
