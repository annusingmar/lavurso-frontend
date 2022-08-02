<template>
  <div class="row flex-center q-col-gutter-md" style="min-height: 75vh">
    <div class="col-md-5 col-sm-10">
      <JournalStudentsList
        :students="students"
        :id="id"
        @refresh-students="getStudents"
      ></JournalStudentsList>
    </div>
    <div class="col-md-5 col-sm-10">
      <JournalStudentsAdd
        :students="students"
        :id="id"
        @refresh-students="getStudents"
      ></JournalStudentsAdd>
    </div>
  </div>

  <q-inner-loading :showing="loading"></q-inner-loading>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";

import JournalStudentsList from "src/components/JournalStudentsList.vue";
import JournalStudentsAdd from "src/components/JournalStudentsAdd.vue";

export default {
  name: "JournalStudents",
  props: ["id"],
  components: { JournalStudentsList, JournalStudentsAdd },
  setup(props) {
    const $q = useQuasar();

    const students = ref([]);
    const loading = ref(true);
    const getStudents = async () => {
      loading.value = true;
      try {
        const response = await api.get("/journals/" + props.id + "/students");
        students.value =
          response.data.students !== null ? response.data.students : [];
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

    getStudents();

    return {
      loading,
      students,
      getStudents,
    };
  },
};
</script>
