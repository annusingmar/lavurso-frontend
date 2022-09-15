<template>
  <div
    class="row flex-center q-col-gutter-md"
    style="min-height: 75vh; align-content: center"
  >
    <div class="col-md-5 col-xs-10">
      <JournalStudentsList
        :id="id"
        :students="students"
        @refresh-students="getStudents"
      ></JournalStudentsList>
    </div>
    <div class="col-md-5 col-xs-10">
      <JournalStudentsAdd
        :id="id"
        :students="students"
        @refresh-students="getStudents"
      ></JournalStudentsAdd>
    </div>
  </div>

  <q-inner-loading :showing="loading"></q-inner-loading>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import JournalStudentsList from "src/components/JournalStudentsList.vue";
import JournalStudentsAdd from "src/components/JournalStudentsAdd.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const students = ref([]);
const loading = ref(true);
const getStudents = async () => {
  loading.value = true;
  try {
    const response = await api.get("/journals/" + props.id + "/students");
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

getStudents();
</script>
