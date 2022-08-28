<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-8 col-xs-10" style="min-width: 0px">
        <q-table
          :title="t('users')"
          :rows="users"
          :columns="columns"
          row-key="id"
          :filter="filter"
          :loading="loading"
          :pagination="{ rowsPerPage: 10 }"
        >
          <template #top-right>
            <div class="row items-end justify-between">
              <div class="col">
                <q-input v-model="filter" :placeholder="t('search')">
                  <template #append>
                    <q-icon name="search"></q-icon>
                  </template>
                </q-input>
              </div>
              <div class="col-auto q-ml-lg">
                <q-btn
                  color="primary"
                  :label="t('user.createUser')"
                  to="/admin/users/new"
                >
                </q-btn>
              </div>
            </div>
          </template>

          <template #body-cell-actions="props">
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
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const router = useRouter();

const columns = [
  {
    name: "name",
    required: true,
    label: t("name"),
    align: "left",
    field: (row) => row.name,
    sortable: false,
  },
  {
    name: "email",
    required: true,
    label: t("email"),
    align: "left",
    field: (row) => row.email,
    sortable: false,
  },
  {
    name: "id_code",
    required: false,
    label: t("user.idCode"),
    align: "left",
    field: (row) => row.id_code,
    sortable: false,
  },
  {
    name: "role",
    required: true,
    label: t("user.role"),
    align: "left",
    field: (row) => row.role,
    format: (val) => t(`roles.${val}`),
    sortable: true,
  },
  { name: "actions", label: t("action") },
];

const users = ref([]);

const loading = ref(true);

const getUsers = async () => {
  loading.value = true;
  try {
    const response = await api.get("/users");
    users.value = response.data.users;
    loading.value = false;
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("dataLoadingFail"),
      timeout: 0,
      actions: [{ label: t("dismiss"), color: "white" }],
    });
  }
};

const filter = ref("");

const editUser = (id) => router.push("/admin/users/" + id);

getUsers();
</script>
