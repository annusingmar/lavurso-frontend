<template>
  <div class="row col-12 items-center q-gutter-md">
    <q-input
      class="col-4"
      :model-value="modelValue.name"
      label="Name"
      filled
      @update:model-value="(val) => emit('update:modelValue', 'name', val)"
    ></q-input>
    <q-input
      class="col-4"
      :model-value="modelValue.displayName"
      label="New year display name"
      filled
      @update:model-value="
        (val) => emit('update:modelValue', 'displayName', val)
      "
    ></q-input>
    <q-btn
      round
      color="red"
      label="-"
      size="sm"
      @click="emit('remove')"
    ></q-btn>
  </div>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "remove"]);
</script>
