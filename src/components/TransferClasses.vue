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
          <th>{{ t("selected") }}</th>
          <th>{{ t("name") }}</th>
          <th>{{ t("learning.years.previousYearDisplayName") }}</th>
          <th>
            {{ t("learning.years.newYearDisplayName") }} ({{ newYearName }})
          </th>
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
    <q-btn color="primary" :label="t('next')" @click="go('next')"></q-btn>
    <q-btn :label="t('back')" @click="go('back')"></q-btn>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import TransferClassItem from "./TransferClassItem.vue";

const { t } = useI18n({ useScope: "global" });

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

// interface transferClass {
//   id: Number;
//   name: String;
//   display_name: String; // previous year display name
//   selected: Boolean;
//   newDisplayName: String; // new year display name
// }
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
