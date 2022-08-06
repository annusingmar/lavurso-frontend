<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: 90vh">
      <div class="col-xl-8 col-sm-10" style="min-width: 0px">
        <q-table
          title="Users"
          :rows="users"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :loading="loading"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template v-slot:top-right>
            <div class="row items-end justify-between">
              <div class="col">
                <q-input v-model="filter" placeholder="Search">
                  <template v-slot:append>
                    <q-icon name="search"></q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-auto q-ml-lg">
                <q-btn
                  color="primary"
                  label="Create User"
                  to="/admin/users/new"
                >
                </q-btn>
              </div>
            </div>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                icon="mode_edit"
                @click="editUser(props.row.id)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();

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
    name: "email",
    required: true,
    label: "Email",
    align: "left",
    field: (row) => row.email,
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
  { name: "actions", label: "Action" },
];

const users = ref([]);

const loading = ref(true);

api
  .get("/users")
  .then((response) => {
    users.value = response.data.users;
    loading.value = false;
  })
  .catch((error) => {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  });

const filter = ref("");

const editUser = (id) => router.push("/admin/users/" + id);
</script>
