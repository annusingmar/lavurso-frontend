<template>
  <div
    class="row flex-center q-py-lg"
    :style="{ 'min-height': isCreate ? '90vh' : '75vh' }"
  >
    <div class="col-md-6 col-xs-10">
      <q-card>
        <q-card-section>
          <div v-if="isCreate" class="text-h4">{{ t("user.createUser") }}</div>
          <div v-else class="text-h4">{{ t("user.editUser") }}</div>
        </q-card-section>
        <q-card-section>
          <q-form
            greedy
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
            @submit.prevent="saveUser"
            @reset="resetData"
          >
            <div class="row justify-between q-col-gutter-md">
              <div class="col-sm-6 col-xs-12 q-gutter-y-sm">
                <q-input
                  v-model.trim="user.name"
                  filled
                  :label="t('name')"
                  :rules="[
                    (val) => (val && val.length > 0) || t('mandatoryField'),
                  ]"
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
                  v-model="user.password"
                  filled
                  :label="t('password')"
                  :type="hidePwd ? 'password' : 'text'"
                  :rules="[
                    (val) =>
                      !isCreate
                        ? true
                        : val && val.length > 0
                        ? true
                        : t('mandatoryField'),
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
                  :label="t('user.phoneNumber')"
                >
                </q-input>
                <q-checkbox
                  v-if="!isCreate"
                  v-model="user.archived"
                  :label="t('archived')"
                ></q-checkbox>
              </div>
              <div class="col-sm-6 col-xs-12 q-gutter-y-sm">
                <q-select
                  v-model="user.role"
                  filled
                  map-options
                  emit-value
                  :disable="!isCreate"
                  :options="roles"
                  :label="t('user.role')"
                  :rules="[(val) => val != null || t('mandatoryField')]"
                >
                </q-select>
                <q-input
                  v-model.number="user.id_code"
                  filled
                  mask="###########"
                  :label="t('user.idCode')"
                  :rules="[
                    (val) =>
                      !(
                        val &&
                        val.toString().length != 0 &&
                        val.toString().length != 11
                      ) || t('mustBeNDigitsLong', [11]),
                  ]"
                >
                </q-input>
                <q-input
                  v-model="user.birth_date"
                  filled
                  mask="####-##-##"
                  :hint="t('format') + ': ' + t('yearMonthDate')"
                  :label="t('user.birthDate')"
                  lazy-rules
                  :rules="[
                    (val) =>
                      val &&
                      val.length != 0 &&
                      (!date.isValid(val) || new Date(val) > new Date())
                        ? t('invalidDate')
                        : true,
                  ]"
                ></q-input>
                <q-select
                  v-if="user.role === 'student'"
                  v-model="user.student.class"
                  filled
                  use-input
                  hide-selected
                  fill-input
                  :label="t('learning.class')"
                  :rules="[(val) => val || t('mandatoryField')]"
                  :options="filteredClasses"
                  option-label="name"
                  option-value="id"
                  @filter="filterClasses"
                ></q-select>
              </div>
            </div>
            <q-card-actions align="right">
              <q-btn
                :loading="saveLoading"
                type="submit"
                color="primary"
                :label="t('save')"
              ></q-btn>
              <q-btn type="reset" :label="t('reset')"></q-btn>
            </q-card-actions>
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
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
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

const user = ref({ student: {} });
const saveLoading = ref(false);
const hidePwd = ref(true);

const resetData = () => {
  if (!props.isCreate) {
    user.value = { ...props.serverUser.user };
    user.value.password = null;
  } else {
    user.value = { student: {} };
  }
};

const roles = [
  {
    label: t("roles.admin"),
    value: "admin",
  },
  {
    label: t("roles.teacher"),
    value: "teacher",
  },
  {
    label: t("roles.parent"),
    value: "parent",
  },
  {
    label: t("roles.student"),
    value: "student",
  },
];

const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  return re.test(email) || t("invalidEmail");
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
    data.class_id = user.value.student.class.id;
  }

  if (user.value.password) {
    data.password = user.value.password;
  }

  if (user.value.archived !== null && user.value.archived !== undefined) {
    data.archived = user.value.archived;
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
      message: t("user.savingUserSucceeded"),
      timeout: 3000,
    });
    saveLoading.value = false;
    if (props.isCreate) {
      router.replace("/admin/users");
    } else {
      emit("refreshUser");
    }
  } catch (error) {
    if (error.response && error.response.status == 409) {
      if (error.response.data.error.includes("email")) {
        user.value.email = "";
        $q.notify({
          type: "negative",
          position: "top",
          message: t("user.emailAlreadyInUse"),
          timeout: 6000,
        });
      } else if (error.response.data.error.includes("ID code")) {
        user.value.id_code = "";
        $q.notify({
          type: "negative",
          position: "top",
          message: t("user.idCodeAlreadyInUse"),
          timeout: 6000,
        });
      }
    } else if (
      error.response &&
      [401, 403, 404].indexOf(error.response.status) > -1
    ) {
      return;
    } else {
      $q.notify({
        type: "negative",
        position: "top",
        message: t("user.savingUserFailed"),
        timeout: 6000,
      });
    }
    saveLoading.value = false;
  }
};

const allClasses = ref(null);
const getAllClasses = async () => {
  try {
    const response = await api.get("/classes?current=true");
    allClasses.value =
      response.data.classes !== null ? response.data.classes : [];
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
