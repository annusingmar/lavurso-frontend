<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-8 col-xs-10">
        <q-card>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div class="text-h5">{{ t("learning.grade_s") }}</div>
              <q-btn color="primary" :label="t('new')" @click="newGrade">
              </q-btn>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-sm">
            <q-table
              :rows="grades"
              :columns="columns"
              :loading="loading"
              :pagination="{ rowsPerPage: 0 }"
              hide-bottom
              flat
              row-key="id"
            >
              <template #body-cell-actions="props">
                <q-td :props="props">
                  <q-btn
                    flat
                    icon="mode_edit"
                    @click="editGrade(props.row)"
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
import AdminGradeEditDialog from "src/components/AdminGradeEditDialog.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const columns = [
  {
    name: "identifier",
    required: true,
    label: t("learning.grades.identifier"),
    align: "left",
    field: (row) => row.identifier,
    sortable: false,
  },
  {
    name: "value",
    required: true,
    label: t("learning.grades.value"),
    align: "left",
    field: (row) => row.value,
    sortable: false,
  },
  { name: "actions", label: t("action") },
];
const loading = ref(true);
const grades = ref([]);
const getGrades = async () => {
  loading.value = true;
  try {
    const response = await api.get("/grades");
    grades.value = response.data.grades !== null ? response.data.grades : [];
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

const editGrade = (grade) => {
  $q.dialog({
    component: AdminGradeEditDialog,
    componentProps: {
      existingGrade: grade,
    },
  }).onOk(getGrades);
};

const newGrade = () => {
  $q.dialog({
    component: AdminGradeEditDialog,
  }).onOk(getGrades);
};

getGrades();
</script>
