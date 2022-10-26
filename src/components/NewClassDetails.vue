<template>
  <div class="row q-col-gutter-y-sm">
    <NewClassItem
      v-for="(_, i) in newClasses"
      :key="i"
      :model-value="newClasses[i]"
      @update:model-value="(field, val) => (newClasses[i][field] = val)"
      @remove="newClasses.splice(i, 1)"
    ></NewClassItem>
  </div>
  <div class="row justify-between q-mt-md">
    <div class="q-gutter-sm">
      <q-btn color="primary" label="Next" @click="go(1)"></q-btn>
      <q-btn label="add" @click="newClasses.push({})"></q-btn>
    </div>
    <q-btn label="back" @click="go(-1)"></q-btn>
  </div>
</template>

<script setup>
import { ref } from "vue";
import NewClassItem from "./NewClassItem.vue";

const emit = defineEmits(["goTo"]);

const props = defineProps({
  propNewClasses: {
    type: Array,
    required: true,
  },
});

const newClasses = ref([]);
// create deep copy of array and its objects
// so we don't mutate props
// check `NewYearPage.vue` for comment
props.propNewClasses.forEach((val) => {
  newClasses.value.push({ ...val });
});

const go = (whereTo) => {
  emit("goTo", newClasses.value, whereTo);
};
</script>
