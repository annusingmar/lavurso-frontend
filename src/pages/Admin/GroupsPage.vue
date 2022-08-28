<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-8 col-xs-10" style="min-width: 0px">
        <q-table
          :title="t('groups')"
          :rows="groups"
          :columns="columns"
          :loading="loading"
          :pagination="{ rowsPerPage: 10 }"
          row-key="id"
        >
          <template #top-right>
            <div class="row items-end">
              <q-btn color="primary" :label="t('new')" @click="newGroupDialog">
              </q-btn>
            </div>
          </template>

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
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const { t } = useI18n({ useScope: "global" });

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
    name: "members",
    required: true,
    label: t("messages.noOfMembers"),
    align: "left",
    field: (row) => row.member_count,
    sortable: true,
  },
  { name: "actions", label: t("action") },
];

const loading = ref(true);
const groups = ref([]);
const getGroups = async () => {
  loading.value = true;
  try {
    const response = await api.get("/groups");
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

getGroups();
</script>
