<template>
  <div class="row items-center justify-between">
    <div
      :class="[
        modelValue.lesson ? 'col-2' : 'col-5',
        modelValue.lower_marks ? 'row items-center q-gutter-x-sm' : '',
      ]"
    >
      <q-btn
        v-if="modelValue.lower_marks"
        :icon="showLowerMarks ? 'expand_less' : 'expand_more'"
        size="sm"
        flat
        dense
        @click="showLowerMarks = !showLowerMarks"
      >
      </q-btn>
      <div class="text-weight-bold">
        {{ modelValue.name }}
      </div>
    </div>
    <div v-if="modelValue.lesson" class="col-5 q-gutter-x-xs">
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
    <div
      v-if="modelValue.marks"
      :class="[modelValue.lesson ? 'col-5' : 'col-7']"
      class="q-gutter-y-sm"
    >
      <StudentsMarksNewListMarkItem
        v-for="(_, i) in modelValue.marks"
        :key="i"
        :model-value="modelValue.marks[i]"
        :lesson-options="!!modelValue.lesson"
        :first="i === 0"
        @add-mark="emit('addMark')"
        @update:model-value="(field, val) => emit('updateMark', i, field, val)"
      ></StudentsMarksNewListMarkItem>
    </div>
  </div>
  <div v-if="showLowerMarks && modelValue.lower_marks">
    <q-list>
      <StudentsMarksNewListLowerMarkItem
        v-for="m in modelValue.lower_marks"
        :key="m.id"
        :mark="m"
      ></StudentsMarksNewListLowerMarkItem>
    </q-list>
  </div>
  <q-separator v-if="separator"></q-separator>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import StudentsMarksNewListLowerMarkItem from "./StudentsMarksNewListLowerMarkItem.vue";
import StudentsMarksNewListMarkItem from "./StudentsMarksNewListMarkItem.vue";

const { t } = useI18n({ useScope: "global" });

defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  separator: {
    type: Boolean,
    required: true,
  },
});

const showLowerMarks = ref(false);

const emit = defineEmits(["updateToggle", "addMark", "updateMark"]);
</script>

<style scoped>
.q-table td {
  padding: 7px 7px;
}
</style>
