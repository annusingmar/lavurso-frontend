<template>
  <q-card>
    <q-card-section>
      <div class="text-h4">Add Students</div>
      <q-separator></q-separator>
      <div class="text-caption">
        Selecting one or more classes will add all users currently part of the
        chosen class to the journal.
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
        label="Students"
        :options="availableStudents"
        option-label="name"
        option-value="id"
        hint="Minimum 4 characters"
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
        label="Classes"
        :options="filteredClasses"
        option-label="name"
        option-value="id"
        @filter="classesFilter"
      ></q-select>
      <div class="row justify-end">
        <q-btn
          color="primary"
          label="add"
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

const $q = useQuasar();
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
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
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
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
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
      message: "Students successfully added",
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
      message: "Adding students failed",
      timeout: 6000,
    });
  } finally {
    addLoading.value = false;
  }
};
</script>
