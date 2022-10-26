<template>
  <tr :class="{ unselected: !modelValue.selected }">
    <td>
      <q-checkbox
        :model-value="modelValue.selected"
        @update:model-value="(val) => updateSelected(val)"
      ></q-checkbox>
    </td>
    <td>{{ modelValue.name }}</td>
    <td>{{ modelValue.display_name }}</td>
    <td>
      <q-input
        :model-value="modelValue.newDisplayName"
        hide-bottom-space
        :rules="[(val) => (val && val.length > 0) || t('mandatoryField')]"
        :disable="!modelValue.selected"
        filled
        @update:model-value="
          (val) => emit('update:modelValue', 'newDisplayName', val)
        "
      ></q-input>
    </td>
  </tr>
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

const emit = defineEmits(["update:modelValue"]);

const updateSelected = (val) => {
  if (!val) {
    emit("update:modelValue", "newDisplayName", "");
    emit("update:modelValue", "selected", val);
  }
  emit("update:modelValue", "selected", val);
};
</script>

<style scoped>
td {
  text-align: center;
}
.unselected {
  background-color: rgba(255, 0, 0, 0.137);
}
</style>
