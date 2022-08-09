<template>
  <div class="row flex-center" style="min-height: 75vh">
    <div class="col-md-6 col-sm-10">
      <q-card>
        <q-card-section>
          <div class="row justify-between">
            <q-btn
              square
              color="primary"
              icon="arrow_back"
              :disabled="course < 2"
              @click="changeCourse('down')"
            ></q-btn>
            <div class="text-h4">{{ course }}. course</div>
            <q-btn
              square
              color="primary"
              icon="arrow_forward"
              @click="changeCourse('up')"
            ></q-btn>
          </div>
          <div class="row flex-center">
            <div class="text-subtitle2">
              {{ journal.content.name }}
            </div>
          </div>
        </q-card-section>
        <q-card-section>
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
              <div v-else>No lessons found.</div>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </div>
  </div>

  <q-inner-loading :showing="loading"></q-inner-loading>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, watch } from "vue";
import JournalLessonsListItem from "src/components/JournalLessonsListItem.vue";
import LessonDialog from "src/components/LessonDialog.vue";

const $q = useQuasar();
const props = defineProps({
  journal: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["refreshJournal"]);

const course = ref(1);
const loading = ref(true);
const lessons = ref([]);
const getLessons = async () => {
  loading.value = true;
  try {
    const response = await api.get(
      "/journals/" + props.journal.content.id + "/lessons",
      {
        params: { course: course.value },
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
watch(
  props.journal,
  () => {
    course.value = props.journal.content.current_course;
    getLessons();
  },
  { immediate: true }
);
const changeCourse = (way) => {
  if (way === "down") {
    course.value--;
  } else {
    course.value++;
  }
  getLessons();
};

const lessonCreateDialog = () => {
  $q.dialog({
    component: LessonDialog,
    componentProps: {
      course: course.value,
      journal: props.journal.content,
    },
  }).onOk(() => {
    emit("refreshJournal");
  });
};
</script>
