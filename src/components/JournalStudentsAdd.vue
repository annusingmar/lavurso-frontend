<template>
  <q-card>
    <q-card-section>
      <div class="text-h4">{{ t("learning.journals.addStudents") }}</div>
      <q-separator></q-separator>
      <div class="text-caption">
        {{ t("learning.journals.addStudentsDescription") }}
      </div>
    </q-card-section>
    <q-card-section class="q-gutter-y-md">
      <q-select
        v-model="chosenStudents"
        filled
        multiple
        use-chips
        use-input
        input-debounce="200"
        stack-label
        :label="t('learning.students')"
        :options="availableStudents"
        option-label="name"
        option-value="id"
        :hint="t('minimumNCharacters', [4])"
        @filter="studentsFilter"
      ></q-select>
      <q-select
        v-model="chosenClasses"
        filled
        multiple
        use-chips
        use-input
        input-debounce="200"
        stack-label
        :label="t('learning.classes')"
        :options="filteredClasses"
        option-label="name"
        option-value="id"
        @filter="classesFilter"
      ></q-select>
      <div class="row justify-end">
        <q-btn
          color="primary"
          :label="t('add')"
          :disable="!atLeastOneChosen"
          :loading="addLoading"
          @click="addMembers"
        ></q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  students: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["refreshStudents"]);

const chosenStudents = ref([]);
const chosenClasses = ref([]);

const studentsFilter = async (val, update, abort) => {
  if (val.length < 4) {
    abort();
    return;
  }
  await getStudents(val);
  update();
};

const filteredClasses = ref(null);
const classesFilter = async (val, update) => {
  if (availableClasses.value !== null) {
    update(() => {
      const v = val.toLowerCase();
      filteredClasses.value = availableClasses.value.filter(
        (g) => g.name.toLowerCase().indexOf(v) > -1
      );
    });
  } else {
    await getClasses();
    update(() => {
      filteredClasses.value = availableClasses.value;
    });
  }
};

const availableStudents = ref(null);
const getStudents = async (search) => {
  try {
    const response = await api.get("/users/search", {
      params: {
        name: search,
      },
    });
    availableStudents.value =
      response.data.result !== null
        ? response.data.result.filter(
            (u) =>
              !props.students.some((su) => su.id === u.id) &&
              u.role === "student"
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

const availableClasses = ref(null);
const getClasses = async () => {
  try {
    const response = await api.get("/classes");
    availableClasses.value =
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

const atLeastOneChosen = computed(
  () => chosenClasses.value.length > 0 || chosenStudents.value.length > 0
);

const addLoading = ref(false);
const addMembers = async () => {
  const studentIDs = [];
  const classIDs = [];

  chosenClasses.value.forEach((c) => classIDs.push(c.id));
  chosenStudents.value.forEach((u) => studentIDs.push(u.id));

  addLoading.value = true;

  try {
    await api.post("/journals/" + props.id + "/students", {
      student_ids: studentIDs,
      class_ids: classIDs,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: t("learning.journals.addingStudentsSucceeded"),
      timeout: 3000,
    });
    chosenClasses.value = [];
    chosenStudents.value = [];
    emit("refreshStudents");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("learning.journals.addingStudentsFailed"),
      timeout: 6000,
    });
  } finally {
    addLoading.value = false;
  }
};
</script>
