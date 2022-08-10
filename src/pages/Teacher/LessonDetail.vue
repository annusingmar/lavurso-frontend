<template>
  <q-page>
    <div
      v-if="!loading"
      class="row flex-center q-py-lg q-col-gutter-md"
      style="min-height: 90vh; align-content: center"
    >
      <div class="col-md-5 col-xs-10">
        <LessonDetailInfo
          :lesson="lesson"
          @refresh-lesson="getLessonData"
        ></LessonDetailInfo>
      </div>
      <div class="flex-break"></div>
      <div class="col-md-5 col-xs-10">
        <StudentsMarksList
          :id="lesson.id"
          :students="students"
          type="lesson"
          :archived="lesson.journal.archived"
          @refresh-above="getLessonData"
        ></StudentsMarksList>
      </div>
    </div>

    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import LessonDetailInfo from "src/components/LessonDetailInfo.vue";
import StudentsMarksList from "src/components/StudentsMarksList.vue";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const loading = ref(true);
const lesson = ref({});
const students = ref([]);
const getLessonData = async () => {
  loading.value = true;
  try {
    const lessonResponse = await api.get("/lessons/" + props.id);
    lesson.value = lessonResponse.data.lesson;
    const studentsResponse = await api.get("/lessons/" + props.id + "/marks");
    students.value =
      studentsResponse.data.students !== null
        ? studentsResponse.data.students
        : [];
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
        message: "Loading of data failed",
        timeout: 0,
        actions: [{ label: "Dismiss", color: "white" }],
      });
    }
  }
};

getLessonData();
</script>

<style scoped>
.flex-break {
  flex: 1 0 100% !important;
}
</style>
