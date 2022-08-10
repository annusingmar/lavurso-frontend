<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Grades</div>
    </q-card-section>
    <q-card-section v-if="!loading">
      <StudentsMarksList
        :id="journal.content.id"
        :students="students"
        type="course"
        :course="course"
        :archived="journal.content.archived"
        @refresh-above="getCourseStudents"
      ></StudentsMarksList>
    </q-card-section>
  </q-card>
  <q-inner-loading :showing="loading"></q-inner-loading>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, watch } from "vue";
import StudentsMarksList from "./StudentsMarksList.vue";

const $q = useQuasar();
const props = defineProps({
  journal: {
    type: Object,
    required: true,
  },
  course: {
    type: Number,
    required: true,
  },
});

const loading = ref(true);
const students = ref([]);
const getCourseStudents = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      "/journals/" +
        props.journal.content.id +
        "/course/" +
        props.course +
        "/grades"
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

watch(props, getCourseStudents, { immediate: true });
</script>
