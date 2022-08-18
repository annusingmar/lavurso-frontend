<template>
  <q-card>
    <q-card-section>
      <div class="text-h5">{{ journal.subject.name }}</div>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section v-if="journal.marks" class="q-gutter-y-md">
      <StudentCourseItem
        v-for="(marks, course) in journal.marks"
        :key="course"
        :course="Number(course)"
        :marks="marks"
        :student-id="studentId"
        :journal-id="journal.id"
      ></StudentCourseItem>
    </q-card-section>
    <q-card-section v-else>No courses found</q-card-section>
  </q-card>
</template>

<script setup>
import StudentCourseItem from "./StudentCourseItem.vue";
const props = defineProps({
  studentId: {
    type: Number,
    required: true,
  },
  journal: {
    type: Object,
    required: true,
  },
});
</script>
