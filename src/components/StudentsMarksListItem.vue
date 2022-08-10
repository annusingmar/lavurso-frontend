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
          :type="type"
          :editable="!archived"
          @refresh-above="$emit('refreshAbove')"
        ></MarkIcon>
      </div>
    </q-item-section>
    <q-item-section v-if="!archived" side>
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
const props = defineProps({
  student: {
    type: Object,
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
});
const emit = defineEmits(["refreshAbove"]);

const addMark = () => {
  $q.dialog({
    component: MarkDialog,
    componentProps: {
      student: props.student,
      id: props.id,
      course: props.course,
      type: props.type,
    },
  }).onOk(() => {
    emit("refreshAbove");
  });
};
</script>
