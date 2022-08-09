<template>
  <q-card>
    <q-card-section>
      <div class="text-h4">Group Members</div>
    </q-card-section>
    <q-card-section>
      <q-table
        :rows="users"
        :columns="columns"
        :loading="loading"
        :pagination="{ rowsPerPage: 5 }"
        row-key="id"
        selection="multiple"
        v-model:selected="selectedUsers"
      >
      </q-table>
      <div class="row justify-end q-mt-md">
        <q-btn
          color="negative"
          label="remove selected"
          :loading="removeLoading"
          :disable="selectedUsers.length === 0"
          @click="removeUsersPrompt"
        ></q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";

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
  loading: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["refreshGroup"]);

const getRoleName = (val) => {
  switch (val) {
    case "admin":
      return "Administrator";
    case "teacher":
      return "Teacher";
    case "parent":
      return "Parent";
    case "student":
      return "Student";
  }
};

const columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => row.name,
    sortable: false,
  },
  {
    name: "role",
    required: true,
    label: "Role",
    align: "left",
    field: (row) => row.role,
    format: (val) => getRoleName(val),
    sortable: true,
  },
];

const selectedUsers = ref([]);

const removeLoading = ref(false);
const removeUsers = async () => {
  removeLoading.value = true;
  const userIDs = [];
  selectedUsers.value.forEach((u) => userIDs.push(u.id));
  try {
    await api.delete("/groups/" + props.group.content.id + "/users", {
      data: {
        user_ids: userIDs,
      },
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: "Users successfully removed",
      timeout: 3000,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Removing users failed",
      timeout: 6000,
    });
  } finally {
    removeLoading.value = false;
    selectedUsers.value = [];
    emit("refreshGroup");
  }
};

const removeUsersPrompt = () => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to remove these users?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    removeUsers();
  });
};
</script>
