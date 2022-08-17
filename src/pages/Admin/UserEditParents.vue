<template>
  <div
    class="row flex-center q-col-gutter-md"
    style="min-height: 75vh; align-content: center"
  >
    <div class="col-md-4 col-xs-10">
      <q-card>
        <q-card-section>
          <div class="text-h4">Parents</div>
        </q-card-section>
        <q-card-section>
          <q-list v-if="studentParents.length > 0" bordered separator>
            <q-item v-for="parent in studentParents" :key="parent.id">
              <q-item-section>{{ parent.name }}</q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  icon="highlight_off"
                  @click="removeParent(parent.id)"
                >
                  <q-tooltip>Remove parent from student</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else>No parents for student</div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-md-4 col-xs-10">
      <q-card>
        <q-card-section>
          <div class="text-h4">Add Parent</div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="chosenParent"
            filled
            use-input
            hide-selected
            fill-input
            input-debounce
            :options="filteredParents"
            option-label="name"
            option-value="id"
            @filter="filter"
          ></q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :loading="addingLoading"
            :disable="chosenParent === null"
            color="primary"
            label="Add"
            @click="addParent"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

import { api } from "src/boot/axios";
import { useQuasar } from "quasar";

const $q = useQuasar();
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const allParents = ref(null);
const studentParents = ref([]);
const filteredParents = ref(null);
const chosenParent = ref(null);
const addingLoading = ref(false);

const getAllParents = async () => {
  try {
    const response = await api.get("/users");
    allParents.value = [];
    allParents.value = response.data.users.filter((user) => {
      if (user.role === "parent" && !studentParents.value) {
        return true;
      } else if (user.role === "parent") {
        return !studentParents.value.some((sp) => sp.id == user.id);
      } else {
        return false;
      }
    });
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

const getStudentParents = async () => {
  try {
    const response = await api.get("/students/" + props.id + "/parents");
    studentParents.value =
      response.data.parents !== null ? response.data.parents : [];
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

const filter = async (val, update) => {
  if (allParents.value !== null) {
    update(() => {
      const v = val.toLowerCase();
      filteredParents.value = allParents.value.filter(
        (p) => p.name.toLowerCase().indexOf(v) > -1
      );
    });
  } else {
    await getAllParents();
    update(() => {
      filteredParents.value = allParents.value;
    });
  }
};

const addParent = async () => {
  addingLoading.value = true;
  try {
    await api.put("/students/" + props.id + "/parents", {
      parent_id: chosenParent.value.id,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: "Parent added successfully",
      timeout: 5000,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Adding parent failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  } finally {
    chosenParent.value = null;
    allParents.value = null;
    await getStudentParents();
    addingLoading.value = false;
  }
};

const removeParent = async (pid) => {
  try {
    await api.delete("/students/" + props.id + "/parents", {
      data: {
        parent_id: pid,
      },
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: "Parent removed successfully",
      timeout: 5000,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Removing parent failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  } finally {
    allParents.value = null;
    await getStudentParents();
  }
};

getStudentParents();
</script>
