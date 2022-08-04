<template>
  <q-card>
    <q-card-section>
      <div class="row justify-between">
        <div class="text-h4">{{ lessonDate }}</div>
        <q-btn color="primary" label="edit lesson"></q-btn>
        <div class="text-h6 text-weight-regular">{{ lesson.journal.name }}</div>
      </div>
      <div>
        <div class="text-subtitle1" v-if="!isDescriptionEmpty">
          {{ lesson.description }}
        </div>
        <div class="text-caption" v-else>No description for lesson</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script>
import { computed } from "vue";
import { date } from "quasar";

export default {
  name: "LessonDetailInfo",
  props: ["lesson"],
  setup(props) {
    const lessonDate = computed(() => {
      const jsDate = new Date(props.lesson.date);
      return date.formatDate(jsDate, "DD MMMM YYYY");
    });

    const isDescriptionEmpty = computed(
      () => props.lesson.description.trim() === ""
    );

    return { lessonDate, isDescriptionEmpty };
  },
};
</script>
