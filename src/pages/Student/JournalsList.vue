<template>
  <q-page>
    <StudentJournals
      :id="Number(id)"
      :key="$route.fullPath"
      class="q-py-lg"
      style="min-height: inherit"
    ></StudentJournals>
  </q-page>
</template>

<script setup>
import StudentJournals from "src/components/StudentJournals.vue";

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
</script>
