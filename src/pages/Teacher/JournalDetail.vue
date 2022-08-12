<template>
  <q-page>
    <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
      <q-tab name="courses" label="Courses"></q-tab>
      <q-tab name="students" label="Students"></q-tab>
      <q-tab name="subject_grades" label="subject grades"></q-tab>
      <q-tab name="general" label="general"></q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels
      v-if="!loading"
      v-model="tab"
      animated
      keep-alive
      style="min-height: 89vh"
    >
      <q-tab-panel name="courses">
        <JournalDetailCourses
          :journal="journal"
          @refresh-journal="getJournal"
        ></JournalDetailCourses>
      </q-tab-panel>
      <q-tab-panel name="students">
        <JournalDetailStudents
          :id="journal.content.id"
          :archived="journal.content.archived"
        ></JournalDetailStudents>
      </q-tab-panel>
      <q-tab-panel name="subject_grades">
        <JournalDetailSubjectGrades
          :journal="journal"
        ></JournalDetailSubjectGrades>
      </q-tab-panel>
      <q-tab-panel name="general">
        <JournalDetailGeneral
          :is-create="false"
          :server-journal="journal"
          @refresh-journal="getJournal"
        ></JournalDetailGeneral>
      </q-tab-panel>
    </q-tab-panels>

    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { reactive, ref } from "vue";
import { useRouter } from "vue-router";
import JournalDetailGeneral from "./JournalDetailGeneral.vue";
import JournalDetailStudents from "./JournalDetailStudents.vue";
import JournalDetailCourses from "./JournalDetailCourses.vue";
import JournalDetailSubjectGrades from "./JournalDetailSubjectGrades.vue";

const $q = useQuasar();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const router = useRouter();

const tab = ref("courses");
const journal = reactive({ content: {} });
const loading = ref(true);
const getJournal = async () => {
  loading.value = true;
  try {
    const response = await api.get("/journals/" + props.id);
    journal.content = response.data.journal;
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
getJournal();
</script>
