<template>
  <div class="row items-center q-gutter-x-sm">
    <div class="col-shrink">
      <div v-if="course > 0">{{ course }}. course</div>
      <div v-else>Summary</div>
    </div>
    <div class="col-grow row justify-between">
      <div class="row q-gutter-x-sm">
        <MarkIcon
          v-for="mark in lessonMarks"
          :key="mark.id"
          :editable="false"
          :extra-info="true"
          :mark="mark"
        ></MarkIcon>
      </div>
      <div class="row q-gutter-x-sm">
        <MarkIcon
          v-for="mark in summaryMarks"
          :key="mark.id"
          :editable="false"
          :extra-info="true"
          :mark="mark"
        ></MarkIcon>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import MarkIcon from "./MarkIcon.vue";

const props = defineProps({
  course: {
    type: String,
    required: true,
  },
  marks: {
    type: Array,
    required: true,
  },
});

const summaryMarks = computed(() =>
  props.marks.filter((m) => {
    return !m.lesson.id;
  })
);
const lessonMarks = computed(() =>
  props.marks.filter((m) => {
    return m.lesson.id;
  })
);
</script>
