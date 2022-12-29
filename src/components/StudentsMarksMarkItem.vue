<template>
  <div
    class="row items-center justify-between q-col-gutter-x-sm q-col-gutter-y-xs"
  >
    <div v-if="lessonOptions" style="flex: 1 1 30%">
      <q-select
        :model-value="modelValue.type"
        :options="markTypes"
        filled
        dense
        options-dense
        map-options
        emit-value
        @update:model-value="(val) => emit('update:modelValue', 'type', val)"
      ></q-select>
    </div>
    <div
      v-if="modelValue.type === 'grade' || !lessonOptions"
      style="flex: 0 0 50px"
    >
      <q-input
        :model-value="modelValue.grade"
        filled
        dense
        no-error-icon
        hide-bottom-space
        :rules="[(val) => validateGrade(val)]"
        @update:model-value="(val) => emit('update:modelValue', 'grade', val)"
      ></q-input>
    </div>
    <div
      :style="{
        flex:
          modelValue.type === 'grade' || !lessonOptions
            ? '9999 0 35%'
            : '9999 0 50%',
      }"
    >
      <q-input
        :model-value="modelValue.comment"
        filled
        dense
        autogrow
        @update:model-value="(val) => emit('update:modelValue', 'comment', val)"
      ></q-input>
    </div>
    <div v-if="first" style="flex: 0 1 42px">
      <q-btn flat round icon="add_circle" size="md" @click="emit('addMark')">
        <q-tooltip>{{ t("learning.marks.addAMark") }}</q-tooltip>
      </q-btn>
    </div>
  </div>
</template>

<script setup>
import { inject } from "vue";
import { useI18n } from "vue-i18n";

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
  first: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["addMark", "update:modelValue"]);
const grades = inject("grades");

const validateGrade = (grade) => {
  if (
    !grade ||
    grade.trim() === "" ||
    grades.value.find((g) => g.identifier === grade)
  ) {
    return true;
  } else {
    return "";
  }
};

const markTypes = [
  {
    label: t("learning.marks.grade"),
    value: "grade",
  },
  {
    label: t("learning.marks.noticeGood"),
    value: "notice_good",
  },
  {
    label: t("learning.marks.noticeNeutral"),
    value: "notice_neutral",
  },
  {
    label: t("learning.marks.noticeBad"),
    value: "notice_bad",
  },
];
</script>
