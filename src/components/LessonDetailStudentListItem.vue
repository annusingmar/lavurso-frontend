<template>
  <q-item>
    <q-item-section>
      <div class="text-weight-bold">{{ student.name }}</div>
    </q-item-section>
    <q-item-section></q-item-section>
    <q-item-section side>
      <q-btn flat round icon="add_circle" @click="addMark">
        <q-tooltip>Add a mark</q-tooltip>
      </q-btn>
    </q-item-section>
  </q-item>
</template>

<script>
import { useQuasar } from "quasar";
import MarkDialog from "./MarkDialog.vue";

export default {
  name: "LessonDetailStudentListItem",
  props: ["student", "lesson"],
  emits: ["refreshLesson"],
  setup(props, context) {
    const $q = useQuasar();

    const addMark = () => {
      $q.dialog({
        component: MarkDialog,
        componentProps: {
          student: props.student,
          lesson: props.lesson,
          type: "lesson",
        },
      }).onOk(() => {
        context.emit("refreshLesson");
      });
    };

    return { addMark };
  },
};
</script>
