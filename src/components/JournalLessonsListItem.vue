<template>
  <q-item clickable v-ripple>
    <q-item-section>
      <q-item-label>{{ lessonDate }}</q-item-label>
      <q-item-label caption lines="1">{{ lesson.description }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
import { computed } from "vue";
import { date } from "quasar";

export default {
  name: "JournalLessonsListItem",
  props: ["lesson"],
  setup(props) {
    const lessonDate = computed(() => {
      const jsDate = new Date(props.lesson.date);
      return date.formatDate(jsDate, "DD MMMM YYYY");
    });

    return { lessonDate };
  },
};
</script>
