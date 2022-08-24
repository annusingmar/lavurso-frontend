<template>
  <q-card>
    <q-card-section class="q-pb-none">
      <div class="text-h6">{{ dayText }}</div>
    </q-card-section>
    <q-card-section v-if="day.marks && day.marks.length > 0" class="q-py-xs">
      <q-card flat>
        <q-card-section class="q-py-none">
          <div class="text-subtitle2">Marks</div>
        </q-card-section>
        <q-card-section class="q-pt-xs q-pb-none">
          <q-list separator>
            <StudentDayMarkItem
              v-for="m in day.marks"
              :key="m.id"
              :mark="m"
            ></StudentDayMarkItem>
          </q-list>
        </q-card-section>
      </q-card>
    </q-card-section>
    <q-card-section
      v-if="day.lessons && day.lessons.length > 0"
      class="q-py-xs"
    >
      <q-card flat>
        <q-card-section class="q-py-none">
          <div class="text-subtitle2">Lessons</div>
        </q-card-section>
        <q-card-section class="q-pt-xs q-pb-none">
          <q-list separator>
            <StudentDayLessonItem
              v-for="l in day.lessons"
              :key="l.id"
              :lesson="l"
            ></StudentDayLessonItem>
          </q-list>
        </q-card-section>
      </q-card>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { computed } from "vue";
import StudentDayLessonItem from "./StudentDayLessonItem.vue";
import StudentDayMarkItem from "./StudentDayMarkItem.vue";

const $q = useQuasar();

const props = defineProps({
  day: {
    type: Object,
    required: true,
  },
});

const dayText = computed(() =>
  date.formatDate(new Date(props.day.date), "dddd, DD. MMMM", $q.lang.date)
);
</script>
