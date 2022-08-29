<template>
  <q-card>
    <q-card-section class="q-pb-none">
      <div class="text-h6">{{ user.name }}</div>
    </q-card-section>
    <q-card-section>
      <q-form
        greedy
        class="q-gutter-y-xs"
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        @submit.prevent="updateUser"
        @reset="resetData"
      >
        <q-input
          v-model.trim="user.name"
          filled
          :label="t('name')"
          :rules="[() => true]"
          disable
        ></q-input>
        <q-input
          v-model.trim="user.email"
          filled
          :label="t('email')"
          :rules="[
            (val) => (val && val.length > 0) || t('mandatoryField'),
            validateEmail,
          ]"
        ></q-input>
        <q-input
          v-model="user.phone_number"
          filled
          :label="t('user.phoneNumber')"
          :rules="[() => true]"
        >
        </q-input>
        <q-input
          v-if="user.id_code"
          v-model.number="user.id_code"
          filled
          :label="t('user.idCode')"
          disable
          :rules="[(val) => true]"
        >
        </q-input>
        <q-input
          v-if="user.birth_date"
          v-model="user.birth_date"
          filled
          disable
          :label="t('user.birthDate')"
        ></q-input>
        <q-card-actions align="right">
          <q-btn
            :loading="saveLoading"
            type="submit"
            color="primary"
            :label="t('save')"
          ></q-btn>
          <q-btn :label="t('cancel')" @click="emit('setEdit', false)"></q-btn>
        </q-card-actions>
      </q-form>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  serverUser: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["setEdit", "refreshUser"]);

const resetData = () => (user.value = { ...props.serverUser });

const user = ref({});

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  return re.test(email) || t("invalidEmail");
};

const saveLoading = ref(false);
const updateUser = async () => {
  saveLoading.value = true;

  let data = { email: user.value.email };
  if (user.value.phone_number && user.value.phone_number.trim() != "") {
    data.phone_number = user.value.phone_number;
  }

  try {
    await api.put("/users/" + props.serverUser.id, data);
    $q.notify({
      type: "positive",
      position: "top",
      message: t("savingSucceeded"),
      timeout: 3000,
    });
    emit("setEdit", false);
    emit("refreshUser");
  } catch (error) {
    if (error.response && error.response.status == 409) {
      $q.notify({
        type: "negative",
        position: "top",
        message: t("user.emailAlreadyInUse"),
        timeout: 6000,
      });
    } else if (
      error.response &&
      [401, 403, 404].indexOf(error.response.status) > -1
    ) {
      return;
    } else {
      $q.notify({
        type: "negative",
        position: "top",
        message: t("savingFailed"),
        timeout: 6000,
      });
    }
    emit("refreshUser");
  } finally {
    saveLoading.value = false;
  }
};

watch(props, resetData, { immediate: true });
</script>
