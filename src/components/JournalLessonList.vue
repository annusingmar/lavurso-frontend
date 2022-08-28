<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between">
        <div class="text-h6 q-mr-sm">{{ t("learning.lesson_s") }}</div>
        <q-btn
          v-if="!journal.content.archived"
          color="primary"
          :label="t('learning.createLesson')"
          @click="lessonCreateDialog"
        ></q-btn>
      </div>
    </q-card-section>
    <q-card-section>
      <q-list v-if="lessons.length > 0" separator>
        <JournalLessonsListItem
          v-for="lesson in lessons"
          :key="lesson.id"
          :lesson="lesson"
        ></JournalLessonsListItem>
      </q-list>
      <div v-else-if="!loading">{{ t("learning.noLessonsFound") }}</div>
    </q-card-section>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import JournalLessonsListItem from "./JournalLessonsListItem.vue";
import LessonDialog from "./LessonDialog.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
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
const emit = defineEmits(["refreshJournal"]);

const lessonCreateDialog = () => {
  $q.dialog({
    component: LessonDialog,
    componentProps: {
      course: props.course,
      journal: props.journal.content,
    },
  }).onOk(() => {
    emit("refreshJournal");
  });
};

const loading = ref(true);
const lessons = ref([]);
const getLessons = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      "/journals/" + props.journal.content.id + "/lessons",
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
watch(props, getLessons, { immediate: true });
</script>
