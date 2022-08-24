<template>
  <q-card>
    <q-card-section
      v-if="showFutureButton"
      class="q-pt-sm q-pb-none row justify-end items-center"
    >
      <q-btn dense size="sm" label="show future" @click="showFuture"></q-btn>
    </q-card-section>
    <q-card-section class="q-gutter-y-sm q-pt-sm">
      <StudentLatestDayCard
        v-for="d in latest"
        :key="d.date"
        :day="d"
      ></StudentLatestDayCard>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { ref } from "vue";
import StudentLatestDayCard from "./StudentLatestDayCard.vue";

const $q = useQuasar();
const { id } = useUserStore();

const loading = ref(true);
const showFutureButton = ref(true);
const latest = ref([]);

const showFuture = () => {
  getLatest(new Date(), null);
  showFutureButton.value = false;
};

const getLatest = async (
  from = date.subtractFromDate(new Date(), { days: 7 }),
  until = new Date(),
  way = "prepend"
) => {
  loading.value = true;

  let params = {
    from: date.formatDate(from, "YYYY-MM-DD"),
  };

  if (until) {
    params.until = date.formatDate(until, "YYYY-MM-DD");
  }

  try {
    const response = await api.get("/students/" + id + "/latest", {
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
      message: "Loading data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};

getLatest();
</script>
