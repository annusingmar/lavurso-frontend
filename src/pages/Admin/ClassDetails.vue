<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-6 col-xs-10">
        <q-card>
          <q-card-section>
            <div v-if="isCreate" class="text-h4">Create Class</div>
            <div v-else class="text-h4">Update Class</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="submitClass">
              <div class="q-gutter-y-md">
                <q-input
                  v-model.trim="name"
                  filled
                  label="Name"
                  autocorrect="off"
                  autocapitalize="off"
                  autocomplete="off"
                  spellcheck="false"
                ></q-input>
                <q-select
                  v-model="teacher"
                  filled
                  label="Teacher"
                  use-input
                  hide-selected
                  fill-input
                  input-debounce
                  hint="Minimum 4 characters"
                  :options="teachers"
                  option-label="name"
                  option-value="id"
                  @filter="teachersFilter"
                ></q-select>
                <div class="row justify-end q-mt-sm">
                  <q-btn
                    :loading="submitLoading"
                    type="submit"
                    color="primary"
                    :disable="buttonDisabled"
                    :label="isCreate ? 'Create' : 'Update'"
                  ></q-btn>
                </div>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { ref, computed, reactive, watch } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const isCreate = computed(() => props.id == 0);

// both

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
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
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

// existing class

const loading = ref(false);
const classs = reactive({ content: {} });
const getClass = async () => {
  loading.value = true;
  try {
    const response = await api.get("/classes/" + props.id);
    classs.content = response.data.class;
    loading.value = false;
  } catch (error) {
    if (error.response && error.response.status == 404) {
      router.replace("/not-found");
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};

const name = ref("");
const teacher = ref(null);
const resetData = () => {
  name.value = classs.content.name;
  teacher.value = classs.content.teacher;
};

watch(classs, resetData);

if (!isCreate.value) {
  getClass();
}

// create/update class request
const submitLoading = ref(false);
const submitClass = async () => {
  submitLoading.value = true;
  const data = {
    name: name.value,
    teacher_id: teacher.value.id,
  };
  try {
    if (!isCreate.value) {
      await api.patch("/classes/" + props.id, data);
    } else {
      await api.post("/classes/", data);
    }
    $q.notify({
      type: "positive",
      position: "top",
      message: (isCreate.value ? "Creating" : "Updating") + " class succeeded!",
      timeout: 3000,
    });
    submitLoading.value = false;
    if (isCreate.value) {
      router.replace("/admin/classes");
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: (isCreate.value ? "Creating" : "Updating") + " class failed!",
      timeout: 6000,
    });
    submitLoading.value = false;
  } finally {
    if (!isCreate.value) {
      getClass();
    }
  }
};

const buttonDisabled = computed(
  () => name.value === "" || teacher.value === null
);
</script>
