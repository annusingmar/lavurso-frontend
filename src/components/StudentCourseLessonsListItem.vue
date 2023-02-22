<template>
  <q-item>
    <q-item-section>
      <div>{{ lessonDate }}</div>
      <div
        v-if="lesson.description && lesson.description.trim() !== ''"
        style="white-space: pre-wrap"
      >
        {{ lesson.description }}
      </div>
      <div v-else class="text-italic">{{ t("learning.noDescription") }}</div>
    </q-item-section>
    <q-item-section
      v-if="lesson.marks && lesson.marks.length > 0"
      class="col-shrink"
    >
      <div class="row justify-end q-gutter-x-sm">
        <MarkIcon
          v-for="mark in lesson.marks"
          :key="mark.id"
          :mark="mark"
          :extra-info="true"
          :show-lesson="false"
          @refresh-above="emit('refreshAbove')"
        ></MarkIcon>
      </div>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import MarkIcon from "./MarkIcon.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  lesson: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["refreshAbove"]);

const lessonDate = computed(() =>
  date.formatDate(new Date(props.lesson.date), "DD. MMMM YYYY", $q.lang.date)
);
</script>
