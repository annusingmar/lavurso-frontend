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
      <div v-else class="row justify-between items-center">
        <div>{{ t("user.twofa.enabledMessage") }}</div>
        <q-btn
          color="negative"
          :label="t('remove')"
          @click="disable2FADialog"
        ></q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
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

const disable2FADialog = () => {
  $q.dialog({
    title: t("confirm"),
    message: t("user.twofa.disableConfirmMessage"),
    cancel: true,
    persistent: true,
  }).onOk(disable2FA);
};

const disable2FA = async () => {
  try {
    api.delete("/users/" + props.id + "/2fa");
    $q.notify({
      type: "positive",
      position: "top",
      message: t("savingSucceeded"),
      timeout: 3000,
    });
    emit("refreshUser");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    } else {
      $q.notify({
        type: "negative",
        position: "top",
        message: t("savingFailed"),
        timeout: 0,
        actions: [{ label: t("dismiss"), color: "white" }],
      });
    }
  }
};
</script>
