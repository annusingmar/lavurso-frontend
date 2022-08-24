<template>
  <q-item>
    <q-item-section avatar>
      <MarkIcon
        :mark="mark"
        :editable="false"
        :extra-info="true"
        :show-lesson="true"
      ></MarkIcon>
    </q-item-section>
    <q-item-section>
      <q-item-label class="text-weight-bold">{{
        mark.subject.name
      }}</q-item-label>
      <q-item-label>{{ mark.comment }}</q-item-label>
    </q-item-section>
    <q-item-section side top>
      <q-item-label>{{ mark.by.name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import MarkIcon from "./MarkIcon.vue";
const props = defineProps({
  mark: {
    type: Object,
    required: true,
  },
});
</script>
