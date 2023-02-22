<template>
  <tr>
    <td>{{ modelValue.display_name }}</td>
    <td>
      <q-input
        :model-value="modelValue.class_name"
        hide-bottom-space
        filled
        @update:model-value="(val) => emit('update:modelValue', val)"
      ></q-input>
    </td>
  </tr>
</template>

<script setup>
defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue"]);
</script>

<style scoped>
td {
  text-align: center;
}
</style>
