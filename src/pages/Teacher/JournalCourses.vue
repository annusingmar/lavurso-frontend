<template>
  <div class="row flex-center" style="min-height: 75vh">
    <div class="col-md-6 col-xs-10">
      <q-card>
        <q-card-section class="q-pb-none">
          <JournalCourseDisplay
            :journal="journal"
            :course="course"
            @change-course="changeCourse"
          ></JournalCourseDisplay>
        </q-card-section>
        <q-card-section class="q-pt-xs">
          <JournalCoursePanels
            :journal="journal"
            :course="course"
            @refresh-journal="$emit('refreshJournal')"
          ></JournalCoursePanels>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";
import JournalCourseDisplay from "src/components/JournalCourseDisplay.vue";
import JournalCoursePanels from "src/components/JournalCoursePanels.vue";

const props = defineProps({
  journal: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["refreshJournal"]);

const course = ref(1);
watch(
  props.journal,
  () => {
    course.value =
      props.journal.content.courses && props.journal.content.courses.length > 0
        ? Math.max(...props.journal.content.courses)
        : 1;
  },
  { immediate: true }
);

const changeCourse = (way) => {
  if (way === "down") {
    course.value--;
  } else {
    course.value++;
  }
};
</script>
