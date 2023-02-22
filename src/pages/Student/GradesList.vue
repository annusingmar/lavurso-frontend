<template>
  <q-page>
    <StudentGrades
      :id="Number(id)"
      :key="$route.fullPath"
      class="q-py-lg"
      style="min-height: inherit"
    ></StudentGrades>
  </q-page>
</template>

<script setup>
import StudentGrades from "src/components/StudentGrades.vue";

defineProps({
  id: {
    type: String,
    required: true,
  },
});
</script>
