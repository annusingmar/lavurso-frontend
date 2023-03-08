<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-10 col-xs-10">
        <q-card>
          <q-card-section class="q-pb-sm">
            <div class="row justify-between items-center">
              <div class="text-h4">Logs</div>
              <div class="row q-gutter-x-md items-center">
                <q-btn label="refresh" color="primary" @click="refresh"></q-btn>
                <q-input
                  v-model="filter"
                  dense
                  :placeholder="t('search')"
                  :debounce="300"
                >
                  <template #append>
                    <q-icon name="search"></q-icon>
                  </template>
                </q-input>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-sm">
            <q-table
              ref="tableRef"
              v-model:pagination="pagination"
              :columns="columns"
              :rows-per-page-options="[25, 50, 100, 200, 500]"
              :loading="loading"
              :rows="rows"
              :filter="filter"
              flat
              dense
              row-key="id"
              @request="onRequest"
            >
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const tableRef = ref(null);
const filter = ref("");
const rows = ref([]);
const loading = ref(false);
const pagination = ref({
  page: 1,
  rowsPerPage: 25,
  rowsNumber: 25,
});

const responseCodeStyle = (row) => {
  if (row.response_code === 401 || row.response_code === 403) {
    return { background: "rgba(255, 0, 0, 0.100)" };
  } else if (row.response_code === 500) {
    return { background: "rgba(175, 0, 255, 0.100)" };
  }
};

const columns = computed(() => [
  {
    name: "name",
    required: false,
    label: t("name"),
    align: "left",
    field: (row) => (row.user && row.user.name) || null,
    sortable: false,
  },
  {
    name: "method",
    required: false,
    label: t("logs.method"),
    align: "left",
    field: (row) => row.method,
    sortable: false,
  },
  {
    name: "target",
    required: false,
    label: t("logs.target"),
    align: "left",
    field: (row) => row.target,
    sortable: false,
  },
  {
    name: "ip",
    required: false,
    label: "IP",
    align: "left",
    field: (row) => row.ip,
    sortable: false,
  },
  {
    name: "response_code",
    required: false,
    label: t("logs.response_code"),
    align: "left",
    field: (row) => row.response_code,
    sortable: false,
    style: responseCodeStyle,
  },
  {
    name: "duration",
    required: false,
    label: t("logs.duration"),
    align: "left",
    field: (row) => row.duration,
    format: (val) => val + " ms",
    sortable: false,
  },
  {
    name: "at",
    required: false,
    label: t("logs.at"),
    align: "left",
    field: (row) => row.at,
    format: (val) => formatDate(val),
    sortable: false,
  },
]);

const onRequest = async (props) => {
  const { page, rowsPerPage } = props.pagination;
  const filter = props.filter;

  loading.value = true;
  try {
    const response = await api.get("/logs", {
      params: {
        page: page,
        limit: rowsPerPage,
        search: filter,
      },
    });

    rows.value = response.data.result.logs ? response.data.result.logs : [];
    pagination.value.rowsNumber = response.data.result.total;
    loading.value = false;
    pagination.value.page = page;
    pagination.value.rowsPerPage = rowsPerPage;
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

const formatDate = (val) => {
  return date.formatDate(new Date(val), "DD. MMMM YYYY HH:mm:ss", $q.lang.date);
};

const refresh = () => {
  tableRef.value.requestServerInteraction();
};

onMounted(() => {
  refresh();
});
</script>
