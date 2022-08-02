<template>
  <q-page>
    <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
      <q-tab name="courses" label="Courses"></q-tab>
      <q-tab name="students" label="Students"></q-tab>
      <q-tab name="general" label="general"></q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated keep-alive v-if="!loading">
      <q-tab-panel name="courses">
        <JournalDetailCourses :journal="journal"></JournalDetailCourses>
      </q-tab-panel>
      <q-tab-panel name="students">
        <JournalDetailStudents :id="journal.content.id"></JournalDetailStudents>
      </q-tab-panel>
      <q-tab-panel name="general">
        <JournalDetailGeneral
          :isCreate="false"
          :serverJournal="journal"
          @refresh-journal="getJournal"
        ></JournalDetailGeneral>
      </q-tab-panel>
    </q-tab-panels>

    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { reactive, ref } from "vue";
import JournalDetailGeneral from "./JournalDetailGeneral.vue";
import JournalDetailStudents from "./JournalDetailStudents.vue";
import JournalDetailCourses from "./JournalDetailCourses.vue";

export default {
  name: "JournalDetail",
  props: ["id"],
  setup(props) {
    const $q = useQuasar();
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
          router.replace("/notFound");
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
    return { tab, journal, loading, getJournal };
  },
  components: {
    JournalDetailGeneral,
    JournalDetailStudents,
    JournalDetailCourses,
  },
};
</script>
