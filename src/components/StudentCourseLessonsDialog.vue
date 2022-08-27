<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section class="row items-center justify-between q-pb-sm">
        <div class="text-h6">
          {{ t("learning.lessons") }}: {{ course }}. {{ t("learning.course") }}
        </div>
        <q-btn icon="close" flat round dense @click="closeDialog"></q-btn>
      </q-card-section>
      <q-card-section>
        <q-list bordered separator>
          <StudentCourseLessonsListItem
            v-for="lesson in lessons"
            :key="lesson.id"
            :lesson="lesson"
            @refresh-above="getLessons"
          ></StudentCourseLessonsListItem>
        </q-list>
      </q-card-section>
      <q-inner-loading :showing="loading"></q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import StudentCourseLessonsListItem from "./StudentCourseLessonsListItem.vue";

const { t } = useI18n({ useScope: "global" });
const $q = useQuasar();

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogCancel } = useDialogPluginComponent();

const closeDialog = onDialogCancel;

const props = defineProps({
  journalId: {
    type: Number,
    required: true,
  },
  course: {
    type: Number,
    required: true,
  },
  studentId: {
    type: Number,
    required: true,
  },
});

const loading = ref(true);
const lessons = ref([]);
const getLessons = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      "/students/" +
        props.studentId +
        "/journals/" +
        props.journalId +
        "/lessons",
      {
        params: { course: props.course },
      }
    );
    lessons.value = response.data.lessons !== null ? response.data.lessons : [];
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
getLessons();
</script>
