<template>
  <div class="row flex-center" style="height: 75vh">
    <div class="col-xl-6 col-md-6 col-sm-12 col-xs-12">
      <q-card>
        <q-card-section>
          <div class="text-h4">Edit User</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="updateUser" @reset="resetData">
            <q-input
              filled
              label="Name"
              v-model.trim="userData.user.name"
              autocorrect="off"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false"
              :rules="[(val) => (val && val.length > 0) || 'Must not be empty']"
            ></q-input>
            <q-input
              filled
              label="Email"
              v-model.trim="userData.user.email"
              autocorrect="off"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false"
              :rules="[
                (val) => (val && val.length > 0) || 'Must not be empty',
                validateEmail,
              ]"
            ></q-input>
            <q-input
              filled
              label="Password"
              type="password"
              v-model="userData.user.password"
            ></q-input>
            <div class="row justify-end q-mt-sm q-gutter-sm">
              <q-btn
                :loading="updateLoading"
                type="submit"
                color="primary"
                label="Update"
              ></q-btn>
              <q-btn type="reset" label="Reset"></q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { toRefs, ref, reactive } from "vue";

export default {
  props: ["id"],
  setup(props) {
    const $q = useQuasar();
    const { id } = toRefs(props);
    const loading = ref(true);
    const userData = reactive({ user: {} });
    const serverUserData = reactive({ user: {} });
    const updateLoading = ref(false);

    const resetData = () => {
      userData.user = {
        name: serverUserData.user.name,
        email: serverUserData.user.email,
        password: null,
      };
    };

    const validateEmail = (email) => {
      const re =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

      return re.test(email) || "Invalid email";
    };

    const updateUser = () => {
      updateLoading.value = true;
      api
        .patch("/users/" + id.value, {
          name: userData.user.name,
          email: userData.user.email,
          password:
            userData.user.password && userData.user.password.length > 0
              ? userData.user.password
              : null,
        })
        .then(() => {
          updateLoading.value = false;
          serverUserData.user = userData.user;
          userData.user.password = null;
          $q.notify({
            type: "positive",
            position: "top",
            message: "Updating user succeeded!",
            timeout: 3000,
          });
        })
        .catch((error) => {
          updateLoading.value = false;
          userData.user.password = null;
          $q.notify({
            type: "negative",
            position: "top",
            message: "Updating user failed",
            timeout: 6000,
          });
        });
    };

    api
      .get("/users/" + id.value)
      .then((response) => {
        serverUserData.user = response.data.user;
        resetData();
        loading.value = false;
      })
      .catch((error) => {
        $q.notify({
          color: "negative",
          position: "top",
          message: "Loading of data failed",
          icon: "report_problem",
          timeout: 0,
        });
      });

    return { userData, resetData, updateUser, updateLoading, validateEmail };
  },
};
</script>
