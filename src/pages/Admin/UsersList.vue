<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-8 col-xs-10" style="min-width: 0px">
        <q-card>
          <q-card-section class="q-pb-none">
            <div class="row justify-between items-center">
              <div class="text-h4">{{ t("users") }}</div>
              <div class="row items-center q-gutter-md">
                <q-input v-model="filter" dense :placeholder="t('search')">
                  <template #append>
                    <q-icon name="search"></q-icon>
                  </template>
                </q-input>
                <q-btn
                  color="accent"
                  :label="archivedButtonText"
                  @click="archived = !archived"
                ></q-btn>
                <q-btn
                  color="primary"
                  :label="t('user.createUser')"
                  to="/admin/users/new"
                >
                </q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-sm q-pb-none">
            <q-table
              :rows="users"
              :columns="columns"
              row-key="id"
              :filter="filter"
              :loading="loading"
              flat
              :pagination="{ rowsPerPage: 10 }"
            >
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
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from "vue";
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
  {
    name: "2FA",
    required: true,
    label: "2FA",
    align: "left",
    field: (row) => row.totp_enabled,
    format: (val) => t(String(val)),
    sortable: true,
  },
  { name: "actions", label: t("action") },
];

const users = ref([]);

const archived = ref(false);

const loading = ref(true);

const getUsers = async () => {
  loading.value = true;
  users.value = [];
  try {
    const response = await api.get("/users", {
      params: { archived: archived.value },
    });
    users.value = response.data.users !== null ? response.data.users : [];
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

watch(archived, getUsers);

const archivedButtonText = computed(() =>
  archived.value ? t("active") : t("archived")
);

getUsers();
</script>
