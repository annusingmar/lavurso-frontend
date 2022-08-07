<template>
  <div
    class="row flex-center q-col-gutter-md"
    style="min-height: 75vh; align-content: center"
  >
    <div class="col-md-5 col-sm-10">
      <JournalStudentsList
        :students="students"
        :id="id"
        :archived="archived"
        @refresh-students="getStudents"
      ></JournalStudentsList>
    </div>
    <div class="col-md-5 col-sm-10" v-if="!archived">
      <JournalStudentsAdd
        :students="students"
        :id="id"
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

import JournalStudentsList from "src/components/JournalStudentsList.vue";
import JournalStudentsAdd from "src/components/JournalStudentsAdd.vue";

const $q = useQuasar();
const props = defineProps(["id", "archived"]);

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
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};

getStudents();
</script>
