<template>
  <q-card>
    <q-card-section>
      <div class="text-h4">Add Members</div>
      <q-separator></q-separator>
      <div class="text-caption">
        Selecting one or more roles/classes will add all users currently part of
        the chosen roles/classes to the group.
      </div>
    </q-card-section>
    <q-card-section class="q-gutter-y-md">
      <q-select
        v-model="chosenRoles"
        filled
        multiple
        use-chips
        :options="roles"
        stack-label
        label="Roles"
      >
      </q-select>
      <q-select
        v-model="chosenUsers"
        filled
        multiple
        use-chips
        use-input
        input-debounce="200"
        stack-label
        label="Users"
        :options="availableUsers"
        option-label="name"
        option-value="id"
        hint="Minimum 4 characters"
        @filter="usersFilter"
      >
        <template #option="scope">
          <q-item v-bind="scope.itemProps">
            <q-item-section>
              <q-item-label>{{ scope.opt.name }}</q-item-label>
              <q-item-label v-if="scope.opt.role !== 'student'" caption>{{
                getRoleName(scope.opt.role)
              }}</q-item-label>
              <q-item-label v-else caption
                >{{ getRoleName(scope.opt.role) }} -
                {{ scope.opt.class.name }}</q-item-label
              >
            </q-item-section>
          </q-item>
        </template>
      </q-select>
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
      <q-btn
        color="primary"
        label="add"
        :disable="!atLeastOneChosen"
        :loading="addLoading"
        @click="addMembers"
      ></q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { computed, ref } from "vue";
import getRoleName from "src/composables/role";

const $q = useQuasar();
const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
  group: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["refreshGroup"]);

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

const chosenRoles = ref([]);
const chosenUsers = ref([]);
const chosenClasses = ref([]);

const usersFilter = async (val, update, abort) => {
  if (val.length < 4) {
    abort();
    return;
  }
  await getUsers(val);
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

const availableUsers = ref(null);
const getUsers = async (search) => {
  try {
    const response = await api.get("/users/search", {
      params: {
        name: search,
      },
    });
    availableUsers.value =
      response.data.result !== null
        ? response.data.result.filter(
            (u) => !props.users.some((guser) => guser.id === u.id)
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
  () =>
    chosenClasses.value.length > 0 ||
    chosenRoles.value.length > 0 ||
    chosenUsers.value.length > 0
);

const addLoading = ref(false);
const addMembers = async () => {
  const sendRoles = [];
  const userIDs = [];
  const classIDs = [];

  chosenClasses.value.forEach((c) => classIDs.push(c.id));
  chosenUsers.value.forEach((u) => userIDs.push(u.id));
  chosenRoles.value.forEach((r) => sendRoles.push(r.value));

  addLoading.value = true;

  try {
    await api.post("/groups/" + props.group.content.id + "/users", {
      user_ids: userIDs,
      roles: sendRoles,
      class_ids: classIDs,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: "Users successfully added",
      timeout: 3000,
    });
    chosenClasses.value = [];
    chosenRoles.value = [];
    chosenUsers.value = [];
    emit("refreshGroup");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: "Adding users failed",
      timeout: 6000,
    });
  } finally {
    addLoading.value = false;
  }
};
</script>
