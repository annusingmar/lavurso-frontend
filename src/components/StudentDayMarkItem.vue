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
      <div class="row justify-between q-item__label">
        <q-item-label class="text-weight-bold">{{
          mark.subject.name
        }}</q-item-label>
        <q-item-label caption>{{ mark.teacher.name }}</q-item-label>
      </div>
      <q-item-label v-if="mark.comment" style="white-space: pre">{{
        mark.comment
      }}</q-item-label>
      <q-item-label
        v-if="mark.lesson && mark.lesson.description"
        caption
        :lines="1"
        >{{ mark.lesson.description }}</q-item-label
      >
    </q-item-section>
  </q-item>
</template>

<script setup>
import MarkIcon from "./MarkIcon.vue";
defineProps({
  mark: {
    type: Object,
    required: true,
  },
});
</script>
