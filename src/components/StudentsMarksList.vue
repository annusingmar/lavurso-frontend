<template>
  <q-list bordered separator>
    <StudentsMarksListItem
      v-for="student in students"
      :id="id"
      :key="student.id"
      :course="course"
      :student="student"
      :type="type"
      :archived="archived"
      @refresh-above="$emit('refreshAbove')"
    ></StudentsMarksListItem>
  </q-list>
</template>

<script>
import StudentsMarksListItem from "./StudentsMarksListItem.vue";
export default {
  name: "StudentsMarksList",
  components: { StudentsMarksListItem },
  props: {
    students: {
      type: Array,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    id: {
      type: Number,
      required: true,
    },
    course: {
      type: Number,
      required: false,
      default: null,
    },
    archived: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["refreshAbove"],
};
</script>
