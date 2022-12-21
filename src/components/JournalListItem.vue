<template>
  <q-item v-ripple clickable :to="'/teacher/journals/' + journal.id">
    <q-item-section>
      <q-item-label overline>{{ journal.subject.name }}</q-item-label>
      <q-item-label>{{ journal.name }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-item-label caption>{{ teacherNames }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  journal: {
    type: Object,
    required: true,
  },
});

const teacherNames = computed(() => {
  if (props.journal.teachers) {
    return props.journal.teachers.map((val) => val.name).join(", ");
  } else {
    return "";
  }
});
</script>
