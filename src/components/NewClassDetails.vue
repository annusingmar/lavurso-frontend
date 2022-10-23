<template>
  <div class="row q-col-gutter-y-sm">
    <NewClassItem
      v-for="(_, i) in modelValue"
      :key="i"
      :model-value="modelValue[i]"
      :only="modelValue.length === 1"
      @update:model-value="(val) => updateValue(i, val)"
      @remove="emit('remove', i)"
    ></NewClassItem>
  </div>
  <div class="row justify-between q-mt-md">
    <div class="q-gutter-sm">
      <q-btn color="primary" label="Next" @click="emit('next')"></q-btn>
      <q-btn label="add" @click="emit('addNew')"></q-btn>
    </div>
    <q-btn label="back" @click="emit('back')"></q-btn>
  </div>
</template>

<script setup>
import NewClassItem from "./NewClassItem.vue";

const emit = defineEmits([
  "update:modelValue",
  "next",
  "back",
  "addNew",
  "remove",
]);

const props = defineProps({
  modelValue: {
    type: Array,
    required: true,
  },
});

const updateValue = (i, v) => {
  const newValue = props.modelValue;
  newValue[i] = v;
  emit("update:modelValue", newValue);
};
</script>
