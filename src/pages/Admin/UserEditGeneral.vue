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
              :type="hidePwd ? 'password' : 'text'"
              v-model="userData.user.password"
            >
              <template v-slot:append>
                <q-icon
                  :name="hidePwd ? 'visibility_off' : 'visibility'"
                  class="cursor-pointer"
                  @click="hidePwd = !hidePwd"
                ></q-icon>
              </template>
            </q-input>
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
import { ref, reactive, watch } from "vue";

export default {
  emits: ["refreshUser"],
  props: ["serverUser"],
  setup(props, context) {
    const $q = useQuasar();
    const userData = reactive({ user: {} });
    const updateLoading = ref(false);
    const hidePwd = ref(true);

    const resetData = () => {
      userData.user = {
        name: props.serverUser.user.name,
        email: props.serverUser.user.email,
        password: null,
      };
    };

    watch(props.serverUser, () => {
      resetData();
    });

    const validateEmail = (email) => {
      const re =
        /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

      return re.test(email) || "Invalid email";
    };

    const updateUser = async () => {
      updateLoading.value = true;
      try {
        await api.patch("/users/" + props.serverUser.user.id, {
          name: userData.user.name,
          email: userData.user.email,
          password:
            userData.user.password && userData.user.password.length > 0
              ? userData.user.password
              : null,
        });
        $q.notify({
          type: "positive",
          position: "top",
          message: "Updating user succeeded!",
          timeout: 3000,
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Updating user failed",
          timeout: 6000,
        });
      } finally {
        updateLoading.value = false;
        context.emit("refreshUser");
      }
    };

    return {
      userData,
      resetData,
      updateUser,
      updateLoading,
      validateEmail,
      hidePwd,
    };
  },
};
</script>
