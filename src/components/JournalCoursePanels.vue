<template>
  <q-tabs v-model="tab" dense active-color="primary" indicator-color="primary">
    <q-tab name="lessons" label="lessons"></q-tab>
    <q-tab name="grades" label="grades"></q-tab>
  </q-tabs>
  <q-separator></q-separator>
  <q-tab-panels v-model="tab" animated keep-alive>
    <q-tab-panel name="lessons">
      <JournalLessonList
        :journal="journal"
        :course="course"
        @refresh-journal="$emit('refreshJournal')"
      ></JournalLessonList>
    </q-tab-panel>
    <q-tab-panel name="grades">
      <JournalCourseGradesList
        :journal="journal"
        :course="course"
      ></JournalCourseGradesList>
    </q-tab-panel>
  </q-tab-panels>
</template>

<script setup>
import { ref } from "vue";
import JournalLessonList from "./JournalLessonList.vue";
import JournalCourseGradesList from "./JournalCourseGradesList.vue";

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

const tab = ref("lessons");
</script>
