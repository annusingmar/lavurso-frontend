<template>
  <q-card>
    <q-card-section class="q-pb-none">
      <div class="text-h6">{{ t("user.password.changePassword") }}</div>
      <div>{{ t("user.password.passwordChangeDescription") }}</div>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section>
      <q-form
        ref="formRef"
        greedy
        class="q-col-gutter-sm"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        @submit.prevent="changePassword"
      >
        <q-input
          v-model="currentPassword"
          filled
          :label="t('user.password.currentPassword')"
          :rules="[(val) => (val && val.length > 0) || t('mandatoryField')]"
          :error="!!currentPasswordError"
          :error-message="currentPasswordError"
          type="password"
        ></q-input>
        <q-input
          v-model="newPassword"
          filled
          :label="t('user.password.newPassword')"
          :rules="[(val) => (val && val.length > 0) || t('mandatoryField')]"
          type="password"
        ></q-input>
        <q-input
          v-model="confirmNewPassword"
          filled
          :label="t('user.password.confirmNewPassword')"
          :error="!!confirmNewPasswordError"
          :error-message="confirmNewPasswordError"
          :rules="[(val) => (val && val.length > 0) || t('mandatoryField')]"
          type="password"
        ></q-input>

        <div class="row justify-end">
          <q-btn
            :loading="submitLoading"
            type="submit"
            color="primary"
            :label="t('save')"
          ></q-btn>
        </div>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { computed, nextTick, ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const formRef = ref(null);

const currentPassword = ref("");
const currentPasswordError = ref(null);
const newPassword = ref("");
const confirmNewPasswordError = computed(() => {
  if (confirmNewPassword.value.trim() === "") {
    return null;
  } else if (newPassword.value !== confirmNewPassword.value) {
    return t("user.password.passwordsDontMatch");
  } else {
    return null;
  }
});
watch(currentPassword, () => {
  if (currentPassword.value.trim() !== "") {
    currentPasswordError.value = null;
  }
});
const confirmNewPassword = ref("");

const submitLoading = ref(false);
const changePassword = async () => {
  submitLoading.value = true;
  try {
    await api.post("/users/" + props.id + "/password", {
      current_password: currentPassword.value,
      new_password: newPassword.value,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: t("savingSucceeded"),
      timeout: 3000,
    });
  } catch (error) {
    if (error.response) {
      if ([401, 403, 404].indexOf(error.response.status) > -1) {
        return;
      } else if (error.response.status === 409) {
        currentPasswordError.value = t("user.password.incorrectPassword");
        return;
      }
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("savingFailed"),
      timeout: 6000,
    });
  } finally {
    currentPassword.value = "";
    newPassword.value = "";
    confirmNewPassword.value = "";
    nextTick(() => formRef.value.resetValidation());
    submitLoading.value = false;
  }
};
</script>
