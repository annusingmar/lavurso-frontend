<template>
  <div class="row justify-start q-gutter-md">
    <q-input
      v-model="details.displayName"
      label="Display name"
      filled
    ></q-input>
    <q-input
      v-model="details.courses"
      label="Courses"
      type="number"
      filled
    ></q-input>
  </div>
  <q-btn
    class="q-mt-md"
    color="primary"
    label="Next"
    :disable="nextDisabled"
    @click="next"
  ></q-btn>
</template>

<script setup>
import { computed, ref } from "vue";

const props = defineProps({
  propDetails: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["next"]);

// create copy of object
// so we don't mutate props
// check `NewYearPage.vue` for comment
const details = ref({ ...props.propDetails });

const nextDisabled = computed(
  () => !(details.value.displayName !== "" && details.value.courses > 0)
);

const next = () => {
  emit("next", details.value);
};
</script>
