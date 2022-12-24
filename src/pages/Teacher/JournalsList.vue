<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-6 col-xs-10">
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div class="text-h4 q-mr-sm">
                {{ t("learning.journal_s") }}
              </div>
              <div class="row q-gutter-x-md">
                <q-select
                  v-model="year"
                  borderless
                  :options="years"
                  dense
                  dense-options
                  option-value="id"
                  option-label="display_name"
                  @filter="yearsFilter"
                ></q-select>
                <q-btn
                  :label="t('new')"
                  :disable="newButtonDisabled"
                  to="/teacher/journals/new"
                  color="primary"
                ></q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-list v-if="journals && journals.length > 0" separator>
              <JournalListItem
                v-for="journal in journals"
                :key="journal.id"
                :journal="journal"
              ></JournalListItem>
            </q-list>
            <div v-else-if="!loading">{{ t("learning.noJournalsFound") }}</div>
          </q-card-section>
          <q-inner-loading :showing="loading"></q-inner-loading>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { ref, watch, computed } from "vue";
import { useI18n } from "vue-i18n";
import JournalListItem from "src/components/JournalListItem.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const { id, role, current_year } = useUserStore();

const year = ref(current_year);
const years = ref(null);

const loading = ref(true);
const journals = ref([]);
const getJournals = async () => {
  journals.value = [];
  const endpoint =
    role === "admin" ? "/journals" : "/teachers/" + id + "/journals";
  loading.value = true;
  try {
    const response = await api.get(endpoint, {
      params: { year: year.value.id },
    });
    journals.value =
      response.data.journals !== null ? response.data.journals : [];
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

const getYears = async () => {
  try {
    const response = await api.get("/years");
    years.value = response.data.years;
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

const newButtonDisabled = computed(
  () => !current_year || year.value.id != current_year.id
);

const yearsFilter = async (_, update) => {
  if (years.value !== null) {
    update();
    return;
  }

  await getYears();
  update();
};

watch(
  year,
  () => {
    if (year.value !== null) {
      getJournals();
    } else {
      loading.value = false;
    }
  },
  { immediate: true }
);
</script>
