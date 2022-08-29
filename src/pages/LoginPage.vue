<template>
  <div class="row main flex-center">
    <div class="col-sm-4 col-xs-10">
      <q-card>
        <q-card-section class="q-pb-none">
          <div class="text-h4 row justify-around">
            <span>L</span>
            <span>A</span>
            <span>V</span>
            <span>U</span>
            <span>R</span>
            <span>S</span>
            <span>O</span>
          </div>
        </q-card-section>
        <q-card-section
          v-if="errorText"
          class="q-mt-sm q-py-none bg-red flex-center row"
          style="height: 5vh"
        >
          <div class="text-white text-weight-bold">
            {{ errorText }}
          </div>
        </q-card-section>
        <q-form ref="formRef" greedy @submit.prevent="submitLogin">
          <q-card-section class="q-pb-none">
            <q-input
              v-model="email"
              :label="t('email')"
              :rules="[
                (val) => val.length > 0 || t('mandatoryField'),
                validateEmail,
              ]"
              lazy-rules
              outlined
            ></q-input>
            <q-input
              v-model="password"
              :label="t('password')"
              type="password"
              :rules="[(val) => val.length > 0 || t('mandatoryField')]"
              lazy-rules
              outlined
              class="q-mt-sm"
            ></q-input>
          </q-card-section>
          <q-card-actions class="row justify-between">
            <LanguagePicker class="q-ml-md" />
            <q-btn
              color="primary"
              :label="t('login.login')"
              type="submit"
            ></q-btn>
          </q-card-actions>
        </q-form>
        <q-inner-loading :showing="loading"></q-inner-loading>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useUserStore } from "src/stores/user";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import LanguagePicker from "src/components/LanguagePicker.vue";

const router = useRouter();
const userStore = useUserStore();
const { t } = useI18n({ useScope: "global" });

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  return re.test(email) || t("invalidEmail");
};

const props = defineProps({
  redirect: {
    type: String,
    required: false,
    default: "/",
  },
});

const email = ref("");
const password = ref("");
const errorText = ref(null);
const formRef = ref(null);

const loading = ref(false);
const submitLogin = async () => {
  loading.value = true;
  errorText.value = null;
  try {
    const response = await api.post("/authenticate", {
      email: email.value,
      password: password.value,
    });
    userStore.setUser(response.data.session);
    router.replace(props.redirect);
  } catch (error) {
    formRef.value.resetValidation();
    password.value = "";
    if (error.response && error.response.status == 403) {
      errorText.value = t("login.incorrectEmailPassword");
    } else {
      errorText.value = t("login.loginFailed");
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.main {
  position: fixed;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    rgba(29, 26, 87, 1) 0%,
    rgba(38, 164, 242, 1) 100%
  );
}
</style>
