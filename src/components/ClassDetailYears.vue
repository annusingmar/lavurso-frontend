<template>
  <q-card>
    <q-card-section>
      <div class="text-h4">
        {{ t("learning.classes.classYears") }}
      </div>
    </q-card-section>
    <q-card-section>
      <q-markup-table dense flat>
        <thead>
          <tr>
            <th>{{ t("learning.schoolYear") }}</th>
            <th>{{ t("displayName") }}</th>
          </tr>
        </thead>
        <tbody>
          <ClassYearsItem
            v-for="(_, i) in years"
            :key="i"
            :model-value="years[i]"
            @update:model-value="(val) => (years[i].class_name = val)"
          ></ClassYearsItem>
        </tbody>
      </q-markup-table>
      <div class="row justify-end q-mt-sm">
        <q-btn
          :loading="submitLoading"
          color="primary"
          :label="t('save')"
          @click="submitYears"
        ></q-btn>
      </div>
    </q-card-section>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import ClassYearsItem from "./ClassYearsItem.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const loading = ref(false);
const years = ref([]);
const getYears = async () => {
  loading.value = true;
  try {
    const response = await api.get("/classes/" + props.id + "/years");
    years.value = response.data.years;
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

const submitLoading = ref(false);
const submitYears = async () => {
  submitLoading.value = true;
  const data = years.value.map((val) => ({
    year_id: val.year_id,
    name: val.class_name,
  }));
  try {
    await api.put("/classes/" + props.id + "/years", data);
    $q.notify({
      type: "positive",
      position: "top",
      message: t("savingSucceeded"),
      timeout: 3000,
    });
    submitLoading.value = false;
    getYears();
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
    submitLoading.value = false;
  }
};

getYears();
</script>
