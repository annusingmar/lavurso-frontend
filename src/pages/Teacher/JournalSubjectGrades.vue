<template>
  <div class="row flex-center" style="min-height: 75vh">
    <div class="col-md-6 col-xs-10">
      <q-card>
        <q-card-section>
          <div class="row justify-between">
            <div class="text-h6">Grades</div>
            <q-btn
              v-if="!loading"
              color="accent"
              label="course grades"
              @click="showCourseGradesDialog"
            ></q-btn>
          </div>
          <div class="text-caption">
            Here you can add grades to students for this journal's subject
            (<span class="text-weight-bold">{{
              journal.content.subject.name
            }}</span
            >)
          </div>
        </q-card-section>
        <q-card-section v-if="!loading">
          <StudentsMarksList
            :id="journal.content.id"
            :students="students"
            type="subject"
            :editable="!journal.content.archived"
            @refresh-above="getJournalStudents"
          ></StudentsMarksList>
        </q-card-section>
      </q-card>
      <q-inner-loading :showing="loading"></q-inner-loading>
    </div>
  </div>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useQuasar } from "quasar";
import StudentsMarksList from "src/components/StudentsMarksList.vue";
import JournalGradesDialog from "src/components/JournalGradesDialog.vue";

const $q = useQuasar();
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
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
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
