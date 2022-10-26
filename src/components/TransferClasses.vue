<template>
  <q-form
    ref="form"
    greedy
    autocorrect="off"
    autocapitalize="off"
    autocomplete="off"
    spellcheck="false"
  >
    <q-markup-table dense flat>
      <thead>
        <tr>
          <th>Selected</th>
          <th>Name</th>
          <th>Old display name</th>
          <th>Display name for {{ newYearName }}</th>
        </tr>
      </thead>
      <tbody>
        <TransferClassItem
          v-for="(_, i) in transferClasses"
          :key="i"
          :model-value="transferClasses[i]"
          @update:model-value="
            (field, val) => (transferClasses[i][field] = val)
          "
        ></TransferClassItem>
      </tbody>
    </q-markup-table>
  </q-form>
  <div class="row justify-between q-mt-sm">
    <q-btn color="primary" label="Next" @click="go('next')"></q-btn>
    <q-btn label="back" @click="go('back')"></q-btn>
  </div>
</template>

<script setup>
import { ref } from "vue";
import TransferClassItem from "./TransferClassItem.vue";

const emit = defineEmits(["goTo"]);

const props = defineProps({
  propClasses: {
    type: Array,
    required: true,
  },
  newYearName: {
    type: String,
    required: true,
  },
});

const form = ref(null);

const transferClasses = ref([]);
// create deep copy of array and its objects
// so we don't mutate props
// check `NewYearPage.vue` for comment
props.propClasses.forEach((val) => {
  transferClasses.value.push({ ...val });
});

const go = async (whereTo) => {
  if (whereTo === "next" && form.value && !(await form.value.validate())) {
    return;
  }
  emit("goTo", transferClasses.value, whereTo);
};
</script>
