<template>
  <div class="row justify-between">
    <q-btn
      square
      color="primary"
      icon="arrow_back"
      :disabled="course < 2"
      @click="$emit('changeCourse', 'down')"
    ></q-btn>
    <div class="text-h4">{{ course }}. course</div>
    <q-btn
      square
      color="primary"
      icon="arrow_forward"
      @click="$emit('changeCourse', 'up')"
    ></q-btn>
  </div>
  <div class="row flex-center">
    <div class="text-subtitle2">
      {{ journal.content.name }}
    </div>
  </div>
</template>

<script>
export default {
  name: "JournalCourseDisplay",
  props: {
    journal: {
      type: Object,
      required: true,
    },
    course: {
      type: Number,
      required: true,
    },
  },
  emits: ["changeCourse"],
};
</script>
