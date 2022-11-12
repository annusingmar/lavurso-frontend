<template>
  <q-card>
    <q-card-section
      class="q-pb-none q-pt-xs row justify-end items-center q-gutter-sm"
    >
      <div v-if="showingFrom">{{ t("showingFrom") }} {{ showingFrom }}</div>
      <q-btn dense size="sm" :label="t('showOlder')" @click="showOlder"></q-btn>
    </q-card-section>
    <q-card-section
      v-if="Object.keys(assignments).length > 0"
      class="q-py-xs q-gutter-y-sm"
    >
      <StudentAssignmentListDayItem
        v-for="a in assignments"
        :id="userID === id ? id : null"
        :key="a.date"
        :date="a.date"
        :assignments="a.assignments"
      />
    </q-card-section>
    <q-card-section v-else class="row justify-center text-h5">
      {{ t("nothingToShow") }}
    </q-card-section>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-card>
</template>

<script setup>
import { api } from "src/boot/axios";
import { computed, ref } from "vue";
import { useQuasar, date } from "quasar";
import { useI18n } from "vue-i18n";
import { useUserStore } from "src/stores/user";
import StudentAssignmentListDayItem from "./StudentAssignmentListDayItem.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const userID = useUserStore().id;

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const loading = ref(true);
const assignments = ref([]);

const showingFrom = computed(() =>
  date.formatDate(currentFrom.value, "DD. MMM YYYY", $q.lang.date)
);

const showOlder = () => {
  getAssignments(oldFrom, oldUntil);
  oldFrom = date.subtractFromDate(oldFrom, { months: 1 });
  oldUntil = date.subtractFromDate(oldUntil, { months: 1 });
  currentFrom.value = oldFrom;
};

let oldFrom = date.subtractFromDate(new Date(), { months: 1 });
let oldUntil = new Date();
let currentFrom = ref(new Date());

const getAssignments = async (from = new Date(), until) => {
  loading.value = true;

  let params = {
    from: date.formatDate(from, "YYYY-MM-DD"),
  };

  if (until) {
    params.until = date.formatDate(until, "YYYY-MM-DD");
  }

  try {
    const response = await api.get("/students/" + props.id + "/assignments", {
      params,
    });

    if (response.data.assignments !== null) {
      assignments.value.unshift(...response.data.assignments);
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

getAssignments();
</script>
