<template>
  <q-page>
    <div class="row q-mx-xl q-my-xl flex-center" style="height: 75vh">
      <div class="col-xl-8 col-md-8 col-sm-12 col-xs-12">
        <q-table
          title="Users"
          :rows="users.list"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :loading="loading"
        >
          <template v-slot:top-right>
            <q-input v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search"></q-icon>
              </template>
            </q-input>
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

<script>
import { ref, reactive } from "vue";
import { api } from "boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default {
  name: "UsersList",
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const getRoleName = (val) => {
      switch (val) {
        case "admin":
          return "Administrator";
          break;
        case "teacher":
          return "Teacher";
          break;
        case "parent":
          return "Parent";
          break;
        case "student":
          return "Student";
          break;
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

    const users = reactive({ list: [] });

    const loading = ref(true);

    api
      .get("/users")
      .then((response) => {
        users.list = response.data.users;
        loading.value = false;
      })
      .catch((error) => {
        console.log(error);
        $q.notify({
          type: "negative",
          position: "top",
          message: "Loading of data failed",
          timeout: 0,
        });
      });

    const filter = ref("");

    const editUser = (id) => router.push("/admin/users/" + id);

    return { columns, users, filter, loading, editUser };
  },
};
</script>
