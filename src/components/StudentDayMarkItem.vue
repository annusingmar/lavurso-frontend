<template>
  <q-item>
    <q-item-section avatar>
      <MarkIcon :mark="mark" :extra-info="true" :show-lesson="true"></MarkIcon>
    </q-item-section>
    <q-item-section>
      <div class="row justify-between q-item__label">
        <div>
          <q-item-label overline>{{ markDisplayType }}</q-item-label>
          <q-item-label class="text-weight-bold">{{
            mark.subject.name
          }}</q-item-label>
        </div>
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
import { computed } from "vue";
import { useMarkLabel } from "../composables/useMarkLabel";
import MarkIcon from "./MarkIcon.vue";
const props = defineProps({
  mark: {
    type: Object,
    required: true,
  },
});

const markDisplayType = computed(() => {
  return useMarkLabel(props.mark);
});
</script>
