<template>
  <div class="row flex-center">
    <div class="col-md-6 col-xs-10">
      <q-card>
        <q-card-section class="row justify-between">
          <div class="text-h5">{{ topText }}</div>
        </q-card-section>
        <q-card-section>
          <div v-if="journals && journals.length > 0" class="q-gutter-y-md">
            <StudentJournalMarksItem
              v-for="j in journals"
              :key="j.id"
              :journal="j"
              :student-id="id"
              @refresh-above="getJournals"
            ></StudentJournalMarksItem>
          </div>
          <q-card v-else-if="!loading">
            <q-card-section
              ><div>{{ t("learning.noJournalsFound") }}</div></q-card-section
            >
          </q-card>
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
import StudentJournalMarksItem from "src/components/StudentJournalMarksItem.vue";

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
    ? `${t("learning.journal_s")} - ` + props.name
    : t("learning.journal_s")
);

const loading = ref(true);
const journals = ref([]);
const getJournals = async () => {
  loading.value = true;
  try {
    const response = await api.get("/students/" + props.id + "/marks");
    journals.value =
      response.data.journals !== null ? response.data.journals : [];
    journals.value.sort((j) => (j.archived ? 1 : 0));
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
getJournals();
</script>
