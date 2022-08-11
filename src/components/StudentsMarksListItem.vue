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
          :editable="editable"
          :extra-info="extraInfo"
          @refresh-above="$emit('refreshAbove')"
        ></MarkIcon>
      </div>
    </q-item-section>
    <q-item-section v-if="editable" side>
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
