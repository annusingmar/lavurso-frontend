<template>
  <q-item>
    <q-item-section>
      <q-item-label class="text-weight-bold">{{
        lesson.subject.name
      }}</q-item-label>
      <q-item-label
        v-if="lesson.description.trim() !== ''"
        style="white-space: pre"
        >{{ lesson.description }}</q-item-label
      >
      <q-item-label v-else caption class="text-italic"
        >No description</q-item-label
      >
    </q-item-section>
  </q-item>
</template>

<script setup>
defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});
</script>
