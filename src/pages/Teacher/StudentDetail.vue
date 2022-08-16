<template>
  <q-page>
    <q-card style="min-height: inherit">
      <q-card-section class="q-pb-none q-pt-xs">
        <div class="row flex-center">
          <div class="text-h6">{{ student.content.name }}</div>
        </div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
          <q-tab name="journals" label="Journals"></q-tab>
          <q-tab name="absences" label="Absences"></q-tab>
          <q-tab name="info" label="Info"></q-tab>
        </q-tabs>
        <q-separator />
        <q-tab-panels v-if="!loading" v-model="tab" animated keep-alive>
          <q-tab-panel name="journals">
            <StudentJournals :id="student.content.id"></StudentJournals>
          </q-tab-panel>
          <q-tab-panel name="absences"></q-tab-panel>
          <q-tab-panel name="info"></q-tab-panel>
        </q-tab-panels>
      </q-card-section>
      <q-inner-loading :showing="loading"></q-inner-loading>
    </q-card>
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
