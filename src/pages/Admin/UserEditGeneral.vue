<template>
  <div
    class="row flex-center q-py-lg"
    :style="{ 'min-height': isCreate ? '90vh' : '75vh' }"
  >
    <div class="col-md-6 col-xs-10">
      <q-card>
        <q-card-section>
          <div v-if="isCreate" class="text-h4">Create User</div>
          <div v-else class="text-h4">Edit User</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="saveUser" @reset="resetData">
            <div class="row justify-between q-col-gutter-md">
              <div class="col-sm-6 col-xs-12 q-gutter-y-sm">
                <q-input
                  v-model.trim="user.name"
                  filled
                  label="Name"
                  :rules="[
                    (val) => (val && val.length > 0) || 'Must not be empty',
                  ]"
                ></q-input>
                <q-input
                  v-model.trim="user.email"
                  filled
                  label="Email"
                  :rules="[
                    (val) => (val && val.length > 0) || 'Must not be empty',
                    validateEmail,
                  ]"
                ></q-input>
                <q-input
                  v-model="user.password"
                  filled
                  label="Password"
                  :type="hidePwd ? 'password' : 'text'"
                  :rules="[
                    (val) =>
                      !isCreate
                        ? true
                        : val && val.length > 0
                        ? true
                        : 'Must not be empty',
                  ]"
                >
                  <template #append>
                    <q-icon
                      :name="hidePwd ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="hidePwd = !hidePwd"
                    ></q-icon>
                  </template>
                </q-input>
                <q-input
                  v-model="user.phone_number"
                  filled
                  label="Phone Number"
                  :rules="[(val) => true]"
                >
                </q-input>
              </div>
              <div class="col-sm-6 col-xs-12 q-gutter-y-sm">
                <q-select
                  v-model="user.role"
                  filled
                  map-options
                  emit-value
                  :disable="!isCreate"
                  :options="roles"
                  label="Role"
                  :rules="[(val) => val != null || 'Must not be empty']"
                >
                </q-select>
                <q-input
                  v-model.number="user.id_code"
                  filled
                  mask="###########"
                  label="ID Code"
                  :rules="[
                    (val) =>
                      !(
                        val &&
                        val.toString().length != 0 &&
                        val.toString().length != 11
                      ) || 'Must be 11 digits long',
                  ]"
                >
                </q-input>
                <q-input
                  v-model="user.birth_date"
                  filled
                  mask="####-##-##"
                  hint="Format: YYYY-MM-DD"
                  label="Birth date"
                  lazy-rules
                  :rules="[
                    (val) =>
                      val &&
                      val.length != 0 &&
                      (!date.isValid(val) || new Date(val) > new Date())
                        ? 'Invalid date'
                        : true,
                  ]"
                ></q-input>
                <q-select
                  v-if="user.role === 'student'"
                  v-model="user.class"
                  filled
                  use-input
                  hide-selected
                  fill-input
                  label="Class"
                  :rules="[(val) => val || 'Must not be empty']"
                  :options="filteredClasses"
                  option-label="name"
                  option-value="id"
                  @filter="filterClasses"
                ></q-select>
              </div>
            </div>
            <div class="row justify-end q-mt-sm q-gutter-sm">
              <q-btn
                :loading="saveLoading"
                type="submit"
                color="primary"
                label="Save"
              ></q-btn>
              <q-btn type="reset" label="Reset"></q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useQuasar, date } from "quasar";
import { api } from "src/boot/axios";
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const props = defineProps({
  isCreate: {
    type: Boolean,
    required: false,
    default: false,
  },
  serverUser: {
    type: Object,
    required: false,
    default: null,
  },
});
const emit = defineEmits(["refreshUser"]);

const user = ref({});
const saveLoading = ref(false);
const hidePwd = ref(true);

const resetData = () => {
  if (!props.isCreate) {
    user.value = { ...props.serverUser.user };
    user.value.password = null;
  } else {
    user.value = {};
  }
};

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

const saveUser = async () => {
  let data = {};

  data.name = user.value.name;
  data.email = user.value.email;

  if (user.value.id_code) {
    data.id_code = user.value.id_code;
  }

  if (user.value.birth_date) {
    data.birth_date = user.value.birth_date;
  }

  if (user.value.phone_number) {
    data.phone_number = user.value.phone_number;
  }

  if (props.isCreate) {
    data.role = user.value.role;
  }

  if (user.value.role === "student") {
    data.class_id = user.value.class.id;
  }

  if (user.value.password) {
    data.password = user.value.password;
  }

  saveLoading.value = true;
  try {
    if (props.isCreate) {
      await api.post("/users", data);
    } else {
      await api.patch("/users/" + props.serverUser.user.id, data);
    }
    $q.notify({
      type: "positive",
      position: "top",
      message: "Saving user succeeded!",
      timeout: 3000,
    });
    saveLoading.value = false;
    if (props.isCreate) {
      router.replace("/admin/users");
    }
  } catch (error) {
    if (error.response && error.response.status == 409) {
      user.value.email = "";
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
        message: "Saving user failed",
        timeout: 6000,
      });
    }
    saveLoading.value = false;
  } finally {
    if (!props.isCreate) {
      emit("refreshUser");
    }
  }
};

const allClasses = ref(null);
const getAllClasses = async () => {
  try {
    const response = await api.get("/classes");
    allClasses.value =
      response.data.classes !== null ? response.data.classes : [];
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};

const filteredClasses = ref([]);
const filterClasses = async (val, update) => {
  if (allClasses.value !== null) {
    update(() => {
      const v = val.toLowerCase();
      filteredClasses.value = allClasses.value.filter(
        (p) => p.name.toLowerCase().indexOf(v) > -1
      );
    });
  } else {
    await getAllClasses();
    update(() => {
      filteredClasses.value = allClasses.value;
    });
  }
};

if (!props.isCreate) {
  watch(props.serverUser, resetData, { immediate: true });
}
</script>
