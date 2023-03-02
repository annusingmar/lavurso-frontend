<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-6 col-xs-10">
        <q-card>
          <q-card-section class="q-pb-none">
            <div class="row justify-between items-center">
              <div class="text-h4">{{ t("learning.class_es") }}</div>
              <div class="q-gutter-sm">
                <q-checkbox
                  :model-value="onlyCurrent"
                  left-label
                  :label="t('onlyCurrentYear')"
                  @update:model-value="updateCurrent"
                ></q-checkbox>
                <q-btn
                  color="primary"
                  :label="t('new')"
                  to="/admin/classes/new"
                >
                </q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section
            :class="['q-pt-sm', onlyCurrent ? 'q-pb-sm' : 'q-pb-none']"
          >
            <q-table
              ref="tableRef"
              :rows="classes"
              :columns="columns"
              :loading="loading"
              :pagination="{ rowsPerPage: 0 }"
              flat
              :hide-bottom="onlyCurrent"
              row-key="id"
            >
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
          </q-card-section>
        </q-card>
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
    sortable: true,
  },
  {
    name: "display_name",
    required: false,
    label: t("displayName"),
    align: "left",
    field: (row) => row.display_name,
    sortable: true,
  },
  {
    name: "teacher",
    required: true,
    label: t("learning.teachers"),
    align: "left",
    field: (row) =>
      row.teachers ? row.teachers.map((val) => val.name).join(", ") : "",
    sortable: true,
  },
  { name: "actions", label: t("action") },
];

const tableRef = ref(null);

const loading = ref(true);
const onlyCurrent = ref(true);
const classes = ref([]);
const getClasses = async () => {
  loading.value = true;
  classes.value = [];
  try {
    const response = await api.get("/classes", {
      params: { current: onlyCurrent.value },
    });
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

const updateCurrent = (val) => {
  onlyCurrent.value = val;
  tableRef.value.setPagination({ rowsPerPage: onlyCurrent.value ? 0 : 15 });
  getClasses();
};

getClasses();
</script>
