<template>
  <q-page>
    <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
      <q-tab name="journals" label="Journals"></q-tab>
      <q-tab name="info" label="Info"></q-tab>
    </q-tabs>
    <q-separator />
    <q-tab-panels
      v-if="student.id"
      v-model="tab"
      animated
      keep-alive
      class="row"
      style="min-height: 89vh; align-items: center"
    >
      <q-tab-panel name="journals">
        <StudentJournals
          :id="student.id"
          :name="student.name"
        ></StudentJournals>
      </q-tab-panel>
      <q-tab-panel name="info">
        <StudentInfo :student="student" :parents="parents"></StudentInfo>
      </q-tab-panel>
    </q-tab-panels>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import StudentJournals from "src/components/StudentJournals.vue";
import StudentInfo from "src/components/StudentInfo.vue";

const $q = useQuasar();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const tab = ref("journals");
const student = ref({});
const parents = ref([]);
const loading = ref(true);
const getStudent = async () => {
  loading.value = true;
  try {
    const response = await api.get("/students/" + props.id);
    student.value = response.data.student;
    parents.value = response.data.parents;
    loading.value = false;
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};

getStudent();
</script>
