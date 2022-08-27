<template>
  <q-card>
    <q-card-section
      v-if="showFutureButton"
      class="q-pb-none q-pt-xs row justify-end items-center"
    >
      <q-btn
        dense
        size="sm"
        :label="t('showFuture')"
        @click="showFuture"
      ></q-btn>
    </q-card-section>
    <q-card-section class="q-py-xs q-gutter-y-sm">
      <StudentLatestDayCard
        v-for="d in latest"
        :key="d.date"
        :day="d"
      ></StudentLatestDayCard>
      <div class="row justify-end items-center q-gutter-sm">
        <div>{{ t("showingFrom") }} {{ showingFrom }}</div>
        <q-btn
          dense
          size="sm"
          :label="t('showOlder')"
          @click="showOlder"
        ></q-btn>
      </div>
    </q-card-section>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-card>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import StudentLatestDayCard from "./StudentLatestDayCard.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const loading = ref(true);
const showFutureButton = ref(true);
const latest = ref([]);

const showFuture = () => {
  getLatest(new Date(), null);
  showFutureButton.value = false;
};

const showingFrom = computed(() =>
  date.formatDate(from.value, "DD. MMM YYYY", $q.lang.date)
);

let from = ref(date.subtractFromDate(new Date(), { days: 7 }));
let until = new Date();

const showOlder = () => {
  from.value = date.subtractFromDate(from.value, { days: 7 });
  until = date.subtractFromDate(until, { days: 7 });
  getLatest(from.value, until, "append");
};

const getLatest = async (from, until, way = "prepend") => {
  loading.value = true;

  let params = {
    from: date.formatDate(from, "YYYY-MM-DD"),
  };

  if (until) {
    params.until = date.formatDate(until, "YYYY-MM-DD");
  }

  try {
    const response = await api.get("/students/" + props.id + "/latest", {
      params,
    });

    if (response.data.latest !== null) {
      if (way === "prepend") {
        latest.value.unshift(...response.data.latest);
      } else {
        latest.value.push(...response.data.latest);
      }
    }

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

getLatest(from.value, until);
</script>
