<template>
  <q-page>
    <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
      <q-tab name="courses" :label="t('learning.courses')"></q-tab>
      <q-tab name="assignments" :label="t('learning.assignment_s')"></q-tab>
      <q-tab name="students" :label="t('learning.students')"></q-tab>
      <q-tab
        name="subject_grades"
        :label="t('learning.marks.subjectGrades')"
      ></q-tab>
      <q-tab name="general" :label="t('general')"></q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels
      v-if="journal.content.id"
      v-model="tab"
      animated
      keep-alive
      class="row"
      style="min-height: 89vh; align-items: center"
    >
      <q-tab-panel name="courses">
        <JournalCourses
          :journal="journal"
          @refresh-journal="getJournal"
        ></JournalCourses>
      </q-tab-panel>
      <q-tab-panel name="assignments">
        <JournalAssignments
          :id="journal.content.id"
          :archived="journal.content.archived"
        ></JournalAssignments>
      </q-tab-panel>
      <q-tab-panel name="students">
        <JournalStudents
          :id="journal.content.id"
          :archived="journal.content.archived"
        ></JournalStudents>
      </q-tab-panel>
      <q-tab-panel name="subject_grades">
        <JournalSubjectGrades :journal="journal"></JournalSubjectGrades>
      </q-tab-panel>
      <q-tab-panel name="general">
        <JournalGeneral
          :is-create="false"
          :server-journal="journal"
          @refresh-journal="getJournal"
        ></JournalGeneral>
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
import { useI18n } from "vue-i18n";
import JournalGeneral from "./JournalGeneral.vue";
import JournalStudents from "./JournalStudents.vue";
import JournalCourses from "./JournalCourses.vue";
import JournalSubjectGrades from "./JournalSubjectGrades.vue";
import JournalAssignments from "./JournalAssignments.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
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
getJournal();
</script>
