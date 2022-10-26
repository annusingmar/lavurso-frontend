<template>
  <q-page>
    <div
      class="row flex-center q-py-lg q-col-gutter-md"
      style="min-height: inherit; align-content: center"
    >
      <div class="col-md-5 col-xs-10">
        <LessonDetailInfo
          v-if="lesson && lesson.id"
          :lesson="lesson"
          @refresh-lesson="getLessonData"
        ></LessonDetailInfo>
      </div>
      <div class="flex-break"></div>
      <div class="col-md-5 col-xs-10">
        <q-card>
          <q-card-section>
            <StudentsMarksList
              v-if="students && students.length > 0"
              :id="lesson.id"
              :students="students"
              :editable="true"
              type="lesson"
              @refresh-above="getLessonData(true)"
            ></StudentsMarksList>
            <div v-else-if="!loading">
              {{ t("learning.noStudentsInJournal") }}
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import LessonDetailInfo from "src/components/LessonDetailInfo.vue";
import StudentsMarksList from "src/components/StudentsMarksList.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const loading = ref(true);
const lesson = ref({});
const students = ref([]);
const getLessonData = async (u) => {
  if (!u) {
    loading.value = true;
  }
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

getLessonData();
</script>

<style scoped>
.flex-break {
  flex: 1 0 100% !important;
}
</style>
