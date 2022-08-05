<template>
  <q-item>
    <q-item-section avatar>
      <div class="text-weight-bold">{{ student.name }}</div>
    </q-item-section>
    <q-item-section>
      <div class="q-gutter-sm row">
        <MarkIcon
          v-for="mark in student.marks"
          :key="mark.id"
          :mark="mark"
        ></MarkIcon>
      </div>
    </q-item-section>
    <q-item-section side>
      <q-btn flat round icon="add_circle" @click="addMark">
        <q-tooltip>Add a mark</q-tooltip>
      </q-btn>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { useQuasar } from "quasar";
import MarkDialog from "./MarkDialog.vue";
import MarkIcon from "./MarkIcon.vue";

const $q = useQuasar();
const props = defineProps(["student", "lesson"]);
const emit = defineEmits(["refreshLesson"]);

const addMark = () => {
  $q.dialog({
    component: MarkDialog,
    componentProps: {
      student: props.student,
      lesson: props.lesson,
      type: "lesson",
    },
  }).onOk(() => {
    emit("refreshLesson");
  });
};
</script>
