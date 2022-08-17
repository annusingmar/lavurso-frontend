<template>
  <q-page>
    <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
      <q-tab name="journals" label="Journals"></q-tab>
      <q-tab name="absences" label="Absences"></q-tab>
      <q-tab name="info" label="Info"></q-tab>
    </q-tabs>
    <q-separator />
    <q-tab-panels
      v-if="student.content.id"
      v-model="tab"
      animated
      keep-alive
      class="row"
      style="min-height: 89vh; align-items: center"
    >
      <q-tab-panel name="journals">
        <StudentJournals
          :id="student.content.id"
          :name="student.content.name"
        ></StudentJournals>
      </q-tab-panel>
      <q-tab-panel name="absences"></q-tab-panel>
      <q-tab-panel name="info"></q-tab-panel>
    </q-tab-panels>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import StudentJournals from "./StudentJournals.vue";

const $q = useQuasar();
const router = useRouter();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const tab = ref("journals");
const student = reactive({ content: {} });
const loading = ref(true);
const getStudent = async () => {
  loading.value = true;
  try {
    const response = await api.get("/users/" + props.id);
    student.content = response.data.user;
    loading.value = false;
  } catch (error) {
    if (error.response && error.response.status == 404) {
      router.replace("/not-found");
    } else if (error.response && error.response.status == 403) {
      router.replace("/access-denied");
    } else {
      $q.notify({
        type: "negative",
        position: "top",
        message: "Loading data failed",
        timeout: 0,
        actions: [{ label: "Dismiss", color: "white" }],
      });
    }
  }
};

getStudent();
</script>
