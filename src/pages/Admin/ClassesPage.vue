<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-6 col-xs-10" style="min-width: 0px">
        <q-table
          :title="t('learning.class_es')"
          :rows="classes"
          :columns="columns"
          :loading="loading"
          :pagination="{ rowsPerPage: 10 }"
          row-key="id"
        >
          <template #top-right>
            <div class="row items-end">
              <q-btn color="primary" :label="t('new')" to="/admin/classes/new">
              </q-btn>
            </div>
          </template>

          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                icon="mode_edit"
                @click="editClass(props.row.id)"
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
    name: "teacher",
    required: true,
    label: t("learning.teacher"),
    align: "left",
    field: (row) => row.teacher.name,
    sortable: true,
  },
  { name: "actions", label: t("action") },
];
const loading = ref(true);
const classes = ref([]);
const getClasses = async () => {
  loading.value = true;
  try {
    const response = await api.get("/classes");
    classes.value = response.data.classes !== null ? response.data.classes : [];
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
const editClass = (id) => router.push("/admin/classes/" + id);
getClasses();
</script>
