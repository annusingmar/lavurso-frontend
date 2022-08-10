<template>
  <q-card>
    <q-card-section>
      <q-list bordered separator>
        <StudentsMarksListItem
          v-for="student in students"
          :id="id"
          :key="student.id"
          :student="student"
          :type="type"
          :archived="archived"
          @refresh-above="$emit('refreshAbove')"
        ></StudentsMarksListItem>
      </q-list>
    </q-card-section>
  </q-card>
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
    archived: {
      type: Boolean,
      required: true,
    },
  },
  emits: ["refreshAbove"],
};
</script>
