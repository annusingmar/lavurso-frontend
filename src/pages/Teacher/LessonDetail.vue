<template>
  <q-page>
    <div
      class="row flex-center q-py-lg q-col-gutter-md"
      style="min-height: 90vh; align-content: center"
      v-if="!loading"
    >
      <div class="col-10">
        <LessonDetailInfo :lesson="lesson"></LessonDetailInfo>
      </div>
      <div class="col-10">
        <LessonDetailStudents
          :students="students"
          :lesson="lesson"
          @refresh-lesson="getLessonData"
        ></LessonDetailStudents>
      </div>
    </div>

    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>
<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import LessonDetailInfo from "src/components/LessonDetailInfo.vue";
import LessonDetailStudents from "src/components/LessonDetailStudents.vue";

export default {
  name: "LessonDetail",
  props: ["id"],
  setup(props) {
    const $q = useQuasar();

    const loading = ref(true);
    const lesson = ref({});
    const students = ref([]);
    const getLessonData = async () => {
      loading.value = true;
      try {
        const lessonResponse = await api.get("/lessons/" + props.id);
        lesson.value = lessonResponse.data.lesson;
        const studentsResponse = await api.get(
          "/lessons/" + props.id + "/students"
        );
        students.value =
          studentsResponse.data.students !== null
            ? studentsResponse.data.students
            : [];
        loading.value = false;
      } catch (error) {
        if (error.response && error.response.status == 404) {
          router.replace("/notFound");
          return;
        }
        $q.notify({
          type: "negative",
          position: "top",
          message: "Loading of data failed",
          timeout: 0,
          actions: [{ label: "Dismiss", color: "white" }],
        });
      }
    };

    getLessonData();

    return {
      loading,
      lesson,
      students,
      getLessonData,
    };
  },
  components: { LessonDetailInfo, LessonDetailStudents },
};
</script>
