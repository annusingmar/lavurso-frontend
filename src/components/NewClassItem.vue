<template>
  <div class="row col-12 items-center q-gutter-md">
    <q-input
      class="col-4"
      :model-value="modelValue.name"
      label="Name"
      filled
      @update:model-value="(val) => updateValue('name', val)"
    ></q-input>
    <q-input
      class="col-4"
      :model-value="modelValue.displayName"
      label="New year display name"
      filled
      @update:model-value="(val) => updateValue('displayName', val)"
    ></q-input>
    <q-btn
      v-if="!only"
      round
      color="red"
      label="-"
      size="sm"
      @click="emit('remove')"
    ></q-btn>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  only: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "remove"]);

const updateValue = (key, val) => {
  emit("update:modelValue", { ...props.modelValue, [key]: val });
};
</script>
