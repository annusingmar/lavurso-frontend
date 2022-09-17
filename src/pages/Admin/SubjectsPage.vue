<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-5 col-xs-10">
        <q-card>
          <q-card-section class="q-pb-none">
            <div class="row justify-between">
              <div class="text-h4">{{ t("learning.subjects") }}</div>
              <q-btn
                color="primary"
                :label="t('new')"
                @click="newSubjectDialog"
              >
              </q-btn>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-sm">
            <q-table
              :rows="subjects"
              :columns="columns"
              :loading="loading"
              :pagination="{ rowsPerPage: 0 }"
              hide-header
              hide-bottom
              flat
              row-key="id"
            >
              <template #body="props">
                <q-tr :props="props">
                  <q-td key="name" :props="props">
                    {{ props.row.name }}
                    <q-popup-edit
                      v-slot="scope"
                      :model-value="props.row.name"
                      buttons
                      :validate="validateName"
                      @save="saveName(props.row.id, $event)"
                    >
                      <q-input
                        v-model="scope.value"
                        dense
                        autofocus
                        :rules="[
                          (val) =>
                            (val && val.length > 0) || t('mandatoryField'),
                        ]"
                        @keyup.enter.stop
                      ></q-input>
                    </q-popup-edit>
                  </q-td>
                </q-tr>
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
    name: "name",
    required: true,
    label: t("name"),
    align: "left",
    field: (row) => row.name,
    sortable: false,
  },
];

const loading = ref(true);
const subjects = ref([]);
const getSubjects = async () => {
  loading.value = true;
  try {
    const response = await api.get("/subjects");
    subjects.value =
      response.data.subjects !== null ? response.data.subjects : [];
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

const validateName = (val) => {
  if (val && val.length > 0) {
    return true;
  }
  return false;
};

const saveName = async (id, val) => {
  try {
    await api.patch("/subjects/" + id, {
      name: val,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: t("savingSucceeded"),
      timeout: 3000,
    });
    getSubjects();
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

const newSubject = async (val) => {
  try {
    await api.post("/subjects", {
      name: val,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: t("savingSucceeded"),
      timeout: 3000,
    });
    getSubjects();
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

const newSubjectDialog = () => {
  $q.dialog({
    title: t("learning.newSubject"),
    prompt: {
      model: "",
      type: "text",
      isValid: (val) => val && val.length > 0,
    },
    cancel: true,
  }).onOk((data) => {
    newSubject(data);
  });
};

getSubjects();
</script>
