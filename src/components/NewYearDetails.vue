<template>
  <div class="row q-gutter-md">
    <q-input
      v-model="details.displayName"
      class="col-5"
      :label="t('name')"
      filled
    ></q-input>
    <q-input
      v-model="details.courses"
      class="col-5"
      :label="t('learning.courses')"
      type="number"
      filled
    ></q-input>
  </div>
  <q-btn
    class="q-mt-md"
    color="primary"
    :label="t('next')"
    :disable="nextDisabled"
    @click="next"
  ></q-btn>
</template>

<script setup>
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
const { t } = useI18n({ useScope: "global" });

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
