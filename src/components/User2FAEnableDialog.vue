<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div>
          {{ t("user.twofa.howToMessage") }}
        </div>
        <!--eslint-disable vue/no-v-html-->
        <!-- we generate this ourselves in assets/qr.js -->
        <a :href="uri">
          <div v-html="qr"></div>
        </a>
        <!--eslint-enable-->
      </q-card-section>
      <q-separator></q-separator>
      <q-card-section class="q-pb-none">
        <q-input
          v-model="totp"
          :label="t('user.twofa.OTP')"
          mask="### ###"
          fill-mask
          unmasked-value
          :error="invalidOTP"
          :error-message="t('user.twofa.invalidOTP')"
          lazy-rules
          filled
        ></q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          :label="t('save')"
          :loading="saveLoading"
          :disable="saveEnabled"
          @click="saveClicked"
        ></q-btn>
        <q-btn :label="t('cancel')" @click="cancelClicked"></q-btn>
      </q-card-actions>
      <q-inner-loading :showing="loading"></q-inner-loading>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { useQRSvg } from "../composables/qr";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const cancelClicked = onDialogCancel;
const saveClicked = async () => {
  try {
    await finish2FA();
    onDialogOK();
  } catch (err) {
    console.log(err);
  }
};

const uri = ref("");
const loading = ref(true);
const qr = ref("");
const start2FA = async () => {
  loading.value = true;
  try {
    const response = await api.post("/users/" + props.id + "/2fa");
    uri.value = response.data.uri;
    qr.value = useQRSvg(uri.value);
    loading.value = false;
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("dataLoadingFail"),
      timeout: 0,
      actions: [{ label: t("dismiss"), color: "white" }],
    });
  }
};

const totp = ref("");
const saveLoading = ref(false);
const invalidOTP = ref(false);
const finish2FA = async () => {
  saveLoading.value = true;
  try {
    await api.post("/users/" + props.id + "/2fa/finish", {
      code: Number(totp.value),
    });
    saveLoading.value = false;
    $q.notify({
      type: "positive",
      position: "top",
      message: t("savingSucceeded"),
      timeout: 3000,
    });
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    } else if (error.response.status === 400) {
      invalidOTP.value = true;
    } else {
      $q.notify({
        type: "negative",
        position: "top",
        message: t("savingFailed"),
        timeout: 0,
        actions: [{ label: t("dismiss"), color: "white" }],
      });
    }
    saveLoading.value = false;
    throw new Error(error);
  }
};

const saveEnabled = computed(() => {
  return totp.value.length !== 6;
});

start2FA();
</script>
