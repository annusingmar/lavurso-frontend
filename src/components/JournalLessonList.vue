<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between">
        <div class="text-h6">Lessons</div>
        <q-btn
          v-if="!journal.content.archived"
          color="primary"
          label="create lesson"
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
      <div v-else-if="!loading">No lessons found.</div>
    </q-card-section>
  </q-card>

  <q-inner-loading :showing="loading"></q-inner-loading>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, watch } from "vue";
import JournalLessonsListItem from "./JournalLessonsListItem.vue";
import LessonDialog from "./LessonDialog.vue";

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
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};
watch(props, getLessons, { immediate: true });
</script>
