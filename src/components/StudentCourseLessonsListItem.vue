<template>
  <q-item>
    <q-item-section>
      <div>{{ lessonDate }}</div>
      <div
        v-if="lesson.description && lesson.description.trim() !== ''"
        style="white-space: pre-wrap"
      >
        {{ lesson.description }}
      </div>
      <div v-else class="text-italic">No description</div>
    </q-item-section>
    <q-item-section
      class="col-shrink"
      v-if="lesson.marks && lesson.marks.length > 0"
    >
      <div class="row justify-end q-gutter-x-sm">
        <MarkIcon
          v-for="mark in lesson.marks"
          :key="mark.id"
          :mark="mark"
          :editable="false"
          :extra-info="true"
          :show-lesson="false"
        ></MarkIcon>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { date } from "quasar";
import { computed } from "vue";
import MarkIcon from "./MarkIcon.vue";

const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});

const lessonDate = computed(() =>
  date.formatDate(new Date(props.lesson.date), "DD MMMM YYYY")
);
</script>
