<template>
  <q-card>
    <q-card-section class="q-pb-none">
      <div class="text-h6">Assignments</div>
      <div class="row justify-end items-center q-gutter-sm">
        <div v-if="showingFrom">Showing from {{ showingFrom }}</div>
        <q-btn dense size="sm" label="show older" @click="showOlder"></q-btn>
      </div>
    </q-card-section>
    <q-card-section class="q-gutter-y-sm">
      <StudentAssignmentListDayItem
        v-for="(a, d) in assignments"
        :id="id"
        :key="d"
        :date="d"
        :assignments="a"
      />
    </q-card-section>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-card>
</template>

<script setup>
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { computed, ref } from "vue";
import { useQuasar, date } from "quasar";
import StudentAssignmentListDayItem from "./StudentAssignmentListDayItem.vue";

const $q = useQuasar();
const { id } = useUserStore();

const loading = ref(true);
const assignments = ref({});

const showingFrom = computed(() =>
  currentFrom.value !== null
    ? date.formatDate(currentFrom.value, "DD. MMM YYYY")
    : null
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
    const response = await api.get("/students/" + id + "/assignments", {
      params,
    });

    if (response.data.assignments !== null) {
      assignments.value = {
        ...response.data.assignments,
        ...assignments.value,
      };
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

getAssignments();
</script>
