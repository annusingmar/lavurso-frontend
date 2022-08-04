<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: 90vh">
      <div class="col-md-6 col-sm-10">
        <q-card>
          <q-card-section>
            <div class="text-h4">Create User</div>
          </q-card-section>
          <q-card-section>
            <q-form
              @submit.prevent="createUser"
              @reset="resetFields"
              ref="form"
            >
              <q-input
                filled
                label="Name"
                v-model.trim="user.name"
                autocorrect="off"
                autocapitalize="off"
                autocomplete="off"
                spellcheck="false"
                :rules="[
                  (val) => (val && val.length > 0) || 'Must not be empty',
                ]"
              ></q-input>
              <q-input
                filled
                label="Email"
                v-model.trim="user.email"
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
                v-model="user.password"
                :rules="[
                  (val) => (val && val.length > 0) || 'Must not be empty',
                ]"
              >
                <template v-slot:append>
                  <q-icon
                    :name="hidePwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="hidePwd = !hidePwd"
                  ></q-icon>
                </template>
              </q-input>

              <q-select
                filled
                v-model="user.role"
                :options="roles"
                label="Role"
                :rules="[(val) => val || 'Must not be empty']"
              >
              </q-select>
              <div class="row justify-end q-mt-sm q-gutter-sm">
                <q-btn
                  :loading="createLoading"
                  type="submit"
                  color="primary"
                  label="Create"
                ></q-btn>
                <q-btn type="reset" label="Reset"></q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { api } from "src/boot/axios";
import { reactive, ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const user = reactive({});
const createLoading = ref(false);
const hidePwd = ref(true);

const roles = [
  {
    label: "Administrator",
    value: "admin",
  },
  {
    label: "Teacher",
    value: "teacher",
  },
  {
    label: "Parent",
    value: "parent",
  },
  {
    label: "Student",
    value: "student",
  },
];

const validateEmail = (email) => {
  const re =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

  return re.test(email) || "Invalid email";
};

const resetFields = () => {
  user.name = "";
  user.email = "";
  user.password = "";
  user.role = null;
};

const createUser = async () => {
  createLoading.value = true;
  try {
    await api.post("/users", {
      name: user.name,
      email: user.email,
      password: user.password,
      role: user.role.value,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: "Creating user succeeded!",
      timeout: 3000,
    });
    router.replace("/admin/users");
  } catch (error) {
    user.password = "";
    if (error.response && error.response.status == 409) {
      (user.email = ""),
        $q.notify({
          type: "negative",
          position: "top",
          message: "Email already exists",
          timeout: 6000,
        });
    } else {
      $q.notify({
        type: "negative",
        position: "top",
        message: "Creating user failed",
        timeout: 6000,
      });
    }
  } finally {
    createLoading.value = false;
  }
};
</script>
