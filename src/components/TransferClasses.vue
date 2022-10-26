<template>
  <div class="row justify-between q-mt-md">
    <div class="q-gutter-sm">
      <q-btn color="primary" label="Next" @click="go(1)"></q-btn>
    </div>
    <q-btn label="back" @click="go(-1)"></q-btn>
  </div>
</template>

<script setup>
const emit = defineEmits("goTo");

const go = (whereTo) => {
  emit("goTo", whereTo);
};
</script>
