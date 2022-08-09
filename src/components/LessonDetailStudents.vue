<template>
  <q-card>
    <q-card-section>
      <q-list bordered separator>
        <LessonDetailStudentListItem
          v-for="student in students"
          :key="student.id"
          :student="student"
          :lesson="lesson"
          @refresh-lesson="$emit('refreshLesson')"
        ></LessonDetailStudentListItem>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script>
import LessonDetailStudentListItem from "./LessonDetailStudentListItem.vue";
export default {
  name: "LessonDetailStudents",
  components: { LessonDetailStudentListItem },
  props: {
    students: {
      type: Array,
      required: true,
    },
    lesson: {
      type: Object,
      required: true,
    },
  },
  emits: ["refreshLesson"],
};
</script>
