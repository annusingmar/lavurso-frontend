<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-8 col-xs-10">
        <q-card>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div class="text-h4">{{ t("learning.schoolYears") }}</div>
              <q-btn
                color="primary"
                :label="t('learning.years.startNewYear')"
                to="/admin/years/new"
              >
              </q-btn>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-sm">
            <q-table
              :rows="years"
              :columns="columns"
              :loading="loading"
              :pagination="{ rowsPerPage: 0 }"
              hide-bottom
              flat
              row-key="id"
            >
              <template #body-cell-current="props">
                <q-td :props="props">
                  <q-badge
                    v-if="props.row.current"
                    :label="t('oneActive')"
                    color="green"
                  ></q-badge>
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

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const columns = [
  {
    name: "display_name",
    required: true,
    label: t("displayName"),
    align: "left",
    field: (row) => row.display_name,
    sortable: false,
  },
  {
    name: "courses",
    required: true,
    label: t("learning.courses"),
    align: "left",
    field: (row) => row.courses,
    sortable: false,
  },
  {
    name: "student_count",
    required: true,
    label: t("user.student.studentCount"),
    align: "left",
    field: (row) => row.stats.student_count,
    sortable: true,
  },
  {
    name: "journal_count",
    required: true,
    label: t("learning.journals.journalCount"),
    align: "left",
    field: (row) => row.stats.journal_count,
    sortable: true,
  },
  {
    name: "current",
    required: true,
    label: t("status"),
    sortable: false,
  },
];

const loading = ref(true);
const years = ref([]);
const getYears = async () => {
  loading.value = true;
  try {
    const response = await api.get("/years?stats=true", {});
    years.value = response.data.years !== null ? response.data.years : [];
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

getYears();
</script>
