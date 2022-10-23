<template>
  <div class="row justify-start q-gutter-md">
    <q-input
      :model-value="modelValue.displayName"
      label="Display name"
      filled
      @update:model-value="(val) => updateValue('displayName', val)"
    ></q-input>
    <q-input
      :model-value="modelValue.courses"
      label="Courses"
      type="number"
      filled
      @update:model-value="(val) => updateValue('courses', val)"
    ></q-input>
  </div>
  <q-btn
    class="q-mt-md"
    color="primary"
    label="Next"
    :disable="nextDisabled"
    @click="emit('next')"
  ></q-btn>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "next"]);

const updateValue = (key, val) =>
  emit("update:modelValue", { ...props.modelValue, [key]: val });

const nextDisabled = computed(
  () => !(props.modelValue.displayName !== "" && props.modelValue.courses > 0)
);
</script>
