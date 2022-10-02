<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin" style="width: 100%">
      <q-card-section>
        <div class="row justify-between">
          <div v-if="type === 'lesson'" class="text-h5">
            {{ t("learning.marks.lessonGrades") }}
          </div>
          <div v-else-if="type === 'course'" class="text-h5">
            {{ t("learning.marks.courseGrades") }}
          </div>
          <q-btn flat round dense icon="close" @click="cancelClicked"></q-btn>
        </div>
      </q-card-section>
      <q-card-section>
        <StudentsMarksList
          v-if="students && students.length > 0"
          :students="students"
          :editable="false"
          :extra-info="true"
        ></StudentsMarksList>
        <div v-else-if="!loading">{{ t("learning.noStudentsInJournal") }}</div>
      </q-card-section>
      <q-inner-loading :showing="loading"></q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import StudentsMarksList from "./StudentsMarksList.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

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

const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();

const cancelClicked = onDialogCancel;

const students = ref([]);
const loading = ref(true);
const getGrades = async () => {
  loading.value = true;

  let params = {};
  if (props.type === "lesson") {
    params.mark_type = "lesson_grade";
    params.course = props.course;
  } else if (props.type === "course") {
    params.mark_type = "course_grade";
  }

  try {
    const response = await api.get("/journals/" + props.id + "/marks", {
      params,
    });
    students.value =
      response.data.students !== null ? response.data.students : [];
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

getGrades();
</script>
