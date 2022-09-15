<template>
  <div class="row flex-center" style="min-height: 75vh">
    <div class="col-md-6 col-xs-10">
      <q-card>
        <q-card-section>
          <div class="row justify-between">
            <div class="text-h6">{{ t("learning.grade_s") }}</div>
            <q-btn
              color="accent"
              :label="t('learning.marks.courseGrades')"
              @click="showCourseGradesDialog"
            ></q-btn>
          </div>
          <div class="text-caption">
            {{ t("learning.marks.subjectGradesAddDescription") }}
            (<span class="text-weight-bold">{{
              journal.content.subject.name
            }}</span
            >)
          </div>
        </q-card-section>
        <q-card-section>
          <StudentsMarksList
            v-if="students && students.length > 0"
            :id="journal.content.id"
            :students="students"
            type="subject"
            @refresh-above="getJournalStudents"
          ></StudentsMarksList>
          <div v-else-if="!loading">
            {{ t("learning.noStudentsInJournal") }}
          </div>
        </q-card-section>
        <q-inner-loading :showing="loading"></q-inner-loading>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import StudentsMarksList from "src/components/StudentsMarksList.vue";
import JournalGradesDialog from "src/components/JournalGradesDialog.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  journal: {
    type: Object,
    required: true,
  },
});

const loading = ref(true);
const students = ref([]);
const getJournalStudents = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      "/journals/" + props.journal.content.id + "/marks",
      {
        params: {
          mark_type: "subject_grade",
        },
      }
    );
    students.value = response.data.students;
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

const showCourseGradesDialog = () => {
  $q.dialog({
    component: JournalGradesDialog,
    componentProps: {
      id: props.journal.content.id,
      type: "course",
    },
  });
};

getJournalStudents();
</script>
