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
        :course="course"
        :marks="marks"
      ></StudentCourseItem>
    </q-card-section>
    <q-card-section v-else>No marks found.</q-card-section>
  </q-card>
</template>

<script setup>
import StudentCourseItem from "./StudentCourseItem.vue";
const props = defineProps({
  journal: {
    type: Object,
    required: true,
  },
});
</script>
