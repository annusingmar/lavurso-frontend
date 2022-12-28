<template>
  <div class="row items-center justify-between">
    <div class="col-2">
      <span class="text-weight-bold">
        {{ modelValue.name }}
      </span>
    </div>
    <div v-if="lessonOptions" class="col-5 q-gutter-x-xs">
      <q-checkbox
        :label="t('learning.marks.absent')"
        color="red"
        :model-value="modelValue.lesson.absent"
        @update:model-value="(val) => emit('updateToggle', 'absent', val)"
      ></q-checkbox>
      <q-checkbox
        :label="t('learning.marks.late')"
        color="yellow"
        :model-value="modelValue.lesson.late"
        @update:model-value="(val) => emit('updateToggle', 'late', val)"
      ></q-checkbox>
      <q-checkbox
        :label="t('learning.marks.notDone')"
        color="red"
        :model-value="modelValue.lesson.not_done"
        @update:model-value="(val) => emit('updateToggle', 'not_done', val)"
      ></q-checkbox>
    </div>
    <div class="col-5 row items-center justify-between q-gutter-sm">
      <template v-if="modelValue.lesson.marks">
        <StudentsMarksNewListMarkItem
          v-for="(_, i) in modelValue.lesson.marks"
          :key="i"
          :model-value="modelValue.lesson.marks[i]"
          :lesson-options="lessonOptions"
          :first="i === 0"
          @add-mark="emit('addMark')"
          @update:model-value="
            (field, val) => emit('updateMark', i, field, val)
          "
        ></StudentsMarksNewListMarkItem>
      </template>
    </div>
  </div>
  <q-separator v-if="separator"></q-separator>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import StudentsMarksNewListMarkItem from "./StudentsMarksNewListMarkItem.vue";

const { t } = useI18n({ useScope: "global" });

defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  lessonOptions: {
    type: Boolean,
    required: false,
    default: false,
  },
  separator: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["updateToggle", "addMark", "updateMark"]);
</script>

<style scoped>
.q-table td {
  padding: 7px 7px;
}
</style>
