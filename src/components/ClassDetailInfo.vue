<template>
  <q-card>
    <q-card-section>
      <div v-if="!isCreate" class="text-h4">
        {{ t("learning.classes.editClass") }}
      </div>
      <div v-else class="text-h4">
        {{ t("learning.classes.createClass") }}
      </div>
    </q-card-section>
    <q-card-section>
      <q-form
        greedy
        autocorrect="off"
        autocapitalize="off"
        autocomplete="off"
        spellcheck="false"
        @submit.prevent="submitClass"
      >
        <div class="q-gutter-y-md">
          <q-input
            v-model.trim="classs.name"
            filled
            :label="t('name')"
          ></q-input>
          <q-select
            v-model="classs.teachers"
            filled
            multiple
            use-chips
            use-input
            input-debounce="200"
            stack-label
            :label="t('learning.teachers')"
            :options="teachers"
            option-label="name"
            option-value="id"
            :hint="t('minimumNCharacters', ['4'])"
            @filter="teachersFilter"
          ></q-select>
          <div class="row justify-end q-mt-sm">
            <q-btn
              :loading="submitLoading"
              type="submit"
              color="primary"
              :disable="buttonDisabled"
              :label="t('save')"
            ></q-btn>
          </div>
        </div>
      </q-form>
    </q-card-section>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const router = useRouter();

const props = defineProps({
  id: {
    type: Number,
    required: false,
    default: 0,
  },
  isCreate: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const loading = ref(false);
const classs = ref({});
const getClass = async () => {
  loading.value = true;
  try {
    const response = await api.get("/classes/" + props.id);
    classs.value = response.data.class;
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

const teachers = ref(null);
const getTeachers = async (search) => {
  try {
    const response = await api.get("/users/search", {
      params: {
        name: search,
      },
    });
    teachers.value =
      response.data.result !== null
        ? response.data.result.filter(
            (u) => u.role === "teacher" || u.role === "admin"
          )
        : [];
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

const teachersFilter = async (val, update, abort) => {
  if (val.length < 4) {
    abort();
    return;
  }
  await getTeachers(val);
  update();
};

const submitLoading = ref(false);
const submitClass = async () => {
  submitLoading.value = true;

  const data = {
    name: classs.value.name,
    teacher_ids: classs.value.teachers
      ? classs.value.teachers.map((t) => t.id)
      : [],
  };

  let newID;
  try {
    if (!props.isCreate) {
      await api.patch("/classes/" + props.id, data);
    } else {
      const response = await api.post("/classes", data);
      newID = response.data.class.id;
    }
    $q.notify({
      type: "positive",
      position: "top",
      message: t("savingSucceeded"),
      timeout: 3000,
    });
    submitLoading.value = false;
    if (props.isCreate) {
      router.replace("/admin/classes/" + newID);
    } else {
      getClass();
    }
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("savingFailed"),
      timeout: 6000,
    });
    submitLoading.value = false;
  }
};

const buttonDisabled = computed(
  () => !classs.value || classs.value.name === ""
);

if (!props.isCreate) {
  getClass();
}
</script>
