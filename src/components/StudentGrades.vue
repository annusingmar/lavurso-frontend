<template>
  <div class="row flex-center">
    <div class="col-md-8 col-xs-10">
      <q-card>
        <q-card-section class="q-pb-none">
          <div class="text-h5">{{ topText }}</div>
        </q-card-section>
        <q-card-section>
          <q-table
            flat
            :columns="columns"
            :rows="subjects"
            :loading="loading"
            :pagination="{ rowsPerPage: 0 }"
            hide-bottom
          >
            <template #body="tprops">
              <q-tr>
                <q-td key="name">
                  {{ tprops.row.name }}
                </q-td>
                <q-td v-for="y in years" :key="y.id">
                  <div class="row q-gutter-x-xs">
                    <MarkIcon
                      v-for="mark in tprops.row.marks[y.id]"
                      :key="mark.id"
                      :extra-info="false"
                      :mark="mark"
                    ></MarkIcon>
                  </div>
                </q-td>
              </q-tr>
            </template>
          </q-table>
        </q-card-section>
        <q-inner-loading :showing="loading"></q-inner-loading>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import MarkIcon from "./MarkIcon.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: false,
    default: null,
  },
});

const topText = computed(() =>
  props.name
    ? `${t("learning.grade_s")} - ` + props.name
    : t("learning.grade_s")
);

const columns = computed(() => {
  return [
    {
      name: "name",
      label: t("learning.subject"),
      field: (row) => row.name,
      align: "left",
    },
    ...years.value.map((val) => {
      return {
        name: val.id,
        label: val.class_name
          ? `${val.display_name} (${val.class_name})`
          : val.display_name,
        field: (row) => row.marks[val.id],
        align: "left",
      };
    }),
  ];
});

const loading = ref(true);
const subjects = ref([]);
const years = ref([]);
const getGrades = async () => {
  loading.value = true;
  try {
    const response = await api.get("/students/" + props.id + "/grades");
    subjects.value =
      response.data.subjects !== null ? response.data.subjects : [];
    years.value =
      response.data.years !== null
        ? [
            ...response.data.years,
            { id: -1, display_name: t("learning.summary") },
          ]
        : [{ id: -1, display_name: t("learning.summary") }];
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

getGrades();
</script>
