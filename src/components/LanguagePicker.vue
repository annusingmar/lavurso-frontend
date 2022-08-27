<template>
  <q-select
    v-model="lang"
    :options="availableLanguages"
    dense
    borderless
    options-dense
    map-options
  ></q-select>
</template>

<script setup>
import { useQuasar } from "quasar";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const i18n = useI18n({ useScope: "global" });

const lang = ref(i18n.locale.value);

const availableLanguages = [
  {
    label: "eesti",
    value: "et",
  },
  {
    label: "English",
    value: "en-US",
  },
];

watch(lang, () => {
  i18n.locale.value = lang.value.value;
  import(`../../node_modules/quasar/lang/${lang.value.value}.mjs`).then((l) =>
    $q.lang.set(l.default)
  );
});
</script>
