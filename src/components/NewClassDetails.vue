<template>
  <div v-if="newClasses.length > 0">
    <q-form
      ref="form"
      class="col-12 q-col-gutter-y-xs"
      greedy
      autocorrect="off"
      autocapitalize="off"
      autocomplete="off"
      spellcheck="false"
    >
      <NewClassItem
        v-for="(_, i) in newClasses"
        :key="i"
        :model-value="newClasses[i]"
        @update:model-value="(field, val) => (newClasses[i][field] = val)"
        @remove="newClasses.splice(i, 1)"
      ></NewClassItem>
    </q-form>
  </div>
  <div v-else class="text-center">Click 'Add' to add a new class</div>
  <div class="row justify-between q-mt-xs">
    <div class="q-gutter-sm">
      <q-btn color="primary" label="Next" @click="go(1)"></q-btn>
      <q-btn color="green" label="add" @click="newClasses.push({})"></q-btn>
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

const form = ref(null);

const newClasses = ref([]);
// create deep copy of array and its objects
// so we don't mutate props
// check `NewYearPage.vue` for comment
props.propNewClasses.forEach((val) => {
  newClasses.value.push({ ...val });
});

const go = async (whereTo) => {
  if (form.value && !(await form.value.validate())) {
    return;
  }
  emit("goTo", newClasses.value, whereTo);
};
</script>
