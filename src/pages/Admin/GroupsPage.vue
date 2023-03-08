<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-8 col-xs-10">
        <q-card>
          <q-card-section class="q-pb-none">
            <div class="row justify-between items-center">
              <div class="text-h4">{{ t("groups") }}</div>
              <div class="q-gutter-md">
                <q-btn
                  color="accent"
                  :label="archivedButtonText"
                  @click="toggleArchived"
                ></q-btn>
                <q-btn
                  color="primary"
                  :label="t('new')"
                  @click="newGroupDialog"
                >
                </q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section
            :class="['q-pt-sm', !archived ? 'q-pb-sm' : 'q-pb-none']"
          >
            <q-table
              ref="tableRef"
              :rows="groups"
              :columns="columns"
              :loading="loading"
              :pagination="{ rowsPerPage: 0 }"
              flat
              :hide-bottom="!archived"
              row-key="id"
            >
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    icon="mode_edit"
                    @click="editGroup(props.row.id)"
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
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const { t } = useI18n({ useScope: "global" });

const columns = computed(() => [
  {
    name: "name",
    required: true,
    label: t("name"),
    align: "left",
    field: (row) => row.name,
    sortable: false,
  },
  {
    name: "members",
    required: true,
    label: t("messages.noOfMembers"),
    align: "left",
    field: (row) => row.member_count,
    sortable: true,
  },
  { name: "actions", label: t("action") },
]);

const tableRef = ref(null);

const loading = ref(true);
const archived = ref(false);
const groups = ref([]);
const getGroups = async () => {
  loading.value = true;
  groups.value = [];
  try {
    const response = await api.get("/groups", {
      params: {
        archived: archived.value,
      },
    });
    groups.value = response.data.groups !== null ? response.data.groups : [];
    loading.value = false;
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

const newGroup = async (val) => {
  try {
    await api.post("/groups", {
      name: val,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: t("savingSucceeded"),
      timeout: 3000,
    });
    getGroups();
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("savingFailed"),
      timeout: 6000,
    });
  }
};

const newGroupDialog = () => {
  $q.dialog({
    title: t("group.newGroup"),
    prompt: {
      model: "",
      type: "text",
      isValid: (val) => val && val.length > 0,
    },
    cancel: true,
  }).onOk((data) => {
    newGroup(data);
  });
};

const editGroup = (id) => router.push("/admin/groups/" + id);

const archivedButtonText = computed(() =>
  archived.value ? t("active") : t("archived")
);

const toggleArchived = () => {
  archived.value = !archived.value;
  tableRef.value.setPagination({ rowsPerPage: archived.value ? 15 : 0 });
  getGroups();
};

getGroups();
</script>
