<template>
  <div class="row items-center q-gutter-md">
    <q-input
      class="col-5"
      :model-value="modelValue.name"
      label="Name"
      :rules="[(val) => (val && val.length > 0) || t('mandatoryField')]"
      filled
      @update:model-value="(val) => emit('update:modelValue', 'name', val)"
    ></q-input>
    <q-input
      class="col-5"
      :model-value="modelValue.displayName"
      label="New year display name"
      :rules="[(val) => (val && val.length > 0) || t('mandatoryField')]"
      filled
      @update:model-value="
        (val) => emit('update:modelValue', 'displayName', val)
      "
    ></q-input>
    <q-btn
      round
      class="q-my-none"
      color="red"
      label="-"
      size="sm"
      @click="emit('remove')"
    ></q-btn>
  </div>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "remove"]);
</script>
