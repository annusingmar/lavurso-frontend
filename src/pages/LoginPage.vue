<template>
  <div class="row main flex-center">
    <div class="col-sm-5 col-xs-10">
      <q-card>
        <q-card-section class="q-pb-none">
          <div class="text-h4 row justify-between">
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
              label="Email"
              :rules="[
                (val) => val.length > 0 || 'Must not be empty',
                validateEmail,
              ]"
              lazy-rules
              outlined
            ></q-input>
            <q-input
              v-model="password"
              label="Password"
              type="password"
              :rules="[(val) => val.length > 0 || 'Must not be empty']"
              lazy-rules
              outlined
              class="q-mt-sm"
            ></q-input>
          </q-card-section>
          <q-card-actions align="right">
            <q-btn color="primary" label="login" type="submit"></q-btn>
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

const router = useRouter();
const userStore = useUserStore();

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  return re.test(email) || "Invalid email";
};

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
    router.replace("/");
  } catch (error) {
    formRef.value.resetValidation();
    password.value = "";
    if (error.response && error.response.status == 403) {
      errorText.value = "Invalid email or password";
    } else {
      errorText.value = "Logging in failed, please try again later";
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
