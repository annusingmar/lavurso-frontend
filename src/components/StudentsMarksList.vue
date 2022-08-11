<template>
  <q-list bordered separator>
    <StudentsMarksListItem
      v-for="student in students"
      :id="id"
      :key="student.id"
      :course="course"
      :student="student"
      :type="type"
      :editable="editable"
      :extra-info="extraInfo"
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
      required: false,
      default: null,
    },
    id: {
      type: Number,
      required: false,
      default: null,
    },
    course: {
      type: Number,
      required: false,
      default: null,
    },
    editable: {
      type: Boolean,
      required: true,
    },
    extraInfo: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  emits: ["refreshAbove"],
};
</script>
