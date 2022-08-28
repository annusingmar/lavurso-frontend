<template>
  <q-expansion-item
    :label="classs.name"
    :caption="classs.teacher.name"
    group="students"
    @show="onShow"
  >
    <q-list v-if="students && students.length > 0" dense>
      <q-item
        v-for="student in students"
        :key="student.id"
        v-ripple
        clickable
        :to="'/teacher/students/' + student.id"
      >
        <q-item-section>
          <q-item-label>{{ student.name }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-list>
    <div v-else-if="!loading">{{ t("learning.noStudentsInClass") }}</div>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-expansion-item>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  classs: {
    type: Object,
    required: true,
  },
});

const onShow = () => {
  if (students.value === null) {
    getStudents();
  }
};

const students = ref(null);
const loading = ref(true);
const getStudents = async () => {
  loading.value = true;
  try {
    const response = await api.get("/classes/" + props.classs.id + "/students");
    students.value = response.data.users !== null ? response.data.users : [];
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
</script>
