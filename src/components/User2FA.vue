<template>
  <q-card>
    <q-card-section class="q-pb-none">
      <div class="text-h6">{{ t("user.twofa.manage2FA") }}</div>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section>
      <div v-if="!enabled" class="row justify-between items-center">
        <div>{{ t("user.twofa.disabledMessage") }}</div>
        <q-btn
          color="primary"
          :label="t('activate')"
          @click="enable2FA"
        ></q-btn>
      </div>
      <div v-else>
        <div>{{ t("user.twofa.enableMessage") }}</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import User2FAEnableDialog from "./User2FAEnableDialog.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  enabled: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["refreshUser"]);

const enable2FA = () => {
  $q.dialog({
    component: User2FAEnableDialog,
    componentProps: {
      id: props.id,
    },
  }).onOk(() => emit("refreshUser"));
};
</script>
