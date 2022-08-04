<template>
  <q-table
    :rows="students"
    :columns="columns"
    row-key="id"
    :loading="loading"
    :pagination="{ rowsPerPage: 10 }"
  ></q-table>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";

const $q = useQuasar();
const props = defineProps(["id"]);

const columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => row.name,
    sortable: false,
  },
];

const students = ref([]);
const loading = ref(true);
const getStudents = async () => {
  loading.value = true;
  try {
    const response = await api.get("/classes/" + props.id + "/students");
    students.value = response.data.users !== null ? response.data.users : [];
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
