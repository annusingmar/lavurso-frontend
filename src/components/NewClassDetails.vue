<template>
  <div v-if="newClasses.length > 0">
    <q-form
      ref="form"
      class="q-col-gutter-y-sm"
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
  <div v-else class="row justify-center">
    {{ t("learning.years.addClassMessage") }}
  </div>
  <div class="row justify-between q-mt-md">
    <div class="q-gutter-sm">
      <q-btn color="primary" :label="t('next')" @click="go('next')"></q-btn>
      <q-btn
        color="green"
        :label="t('add')"
        @click="newClasses.push({})"
      ></q-btn>
    </div>
    <q-btn :label="t('back')" @click="go('back')"></q-btn>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import NewClassItem from "./NewClassItem.vue";

const { t } = useI18n({ useScope: "global" });

const emit = defineEmits(["goTo"]);

const props = defineProps({
  propNewClasses: {
    type: Array,
    required: true,
  },
});

const form = ref(null);

// interface newClass {
//   name: String;
//   newDisplayName: String;
// }
const newClasses = ref([]);

// create deep copy of array and its objects
// so we don't mutate props
// check `NewYearPage.vue` for comment
props.propNewClasses.forEach((val) => {
  newClasses.value.push({ ...val });
});

const go = async (whereTo) => {
  if (whereTo === "next" && form.value && !(await form.value.validate())) {
    return;
  }
  emit("goTo", newClasses.value, whereTo);
};
</script>
