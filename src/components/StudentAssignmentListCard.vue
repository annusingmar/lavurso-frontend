<template>
  <q-card>
    <q-card-section class="q-pb-none">
      <div class="text-h6">Assignments</div>
      <div class="row justify-end items-center">
        <q-btn
          v-if="showOlderButton"
          dense
          size="sm"
          label="show older"
          @click="showOlder"
        ></q-btn>
        <div v-else>No more to show.</div>
      </div>
    </q-card-section>
    <q-card-section class="q-gutter-y-sm">
      <StudentAssignmentListDayItem
        v-for="[key, val] in sortedAssignments"
        :id="id"
        :key="key"
        :date="key"
        :assignments="val"
      />
      <div class="row justify-end items-center">
        <q-btn
          v-if="showMoreButton"
          dense
          size="sm"
          label="show more"
          @click="showMore"
        ></q-btn>
        <div v-else>No more to show.</div>
      </div>
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

// i got no clue whether or not this is efficient
// but it's the best i could come up with
const sortedAssignments = computed(
  () =>
    new Map(
      Array.from(assignments.value).sort((a, b) =>
        date.getDateDiff(new Date(a[0]), new Date(b[0]), "date")
      )
    )
);

const showOlderButton = ref(true);
const showMoreButton = ref(true);

const showOlder = async () => {
  const [f] = sortedAssignments.value.keys();
  const datesAdded = await getAssignments(
    "desc",
    date.subtractFromDate(new Date(f), { days: 1 })
  );
  if (datesAdded < 4) {
    showOlderButton.value = false;
  }
};

const showMore = async () => {
  const datesAdded = await getAssignments(
    "asc",
    date.addToDate(new Date(Array.from(sortedAssignments.value.keys()).pop()), {
      days: 1,
    })
  );
  if (datesAdded < 4) {
    showMoreButton.value = false;
  }
};

const loading = ref(true);
const assignments = ref(new Map());
const getAssignments = async (direction = "asc", startDate = new Date()) => {
  loading.value = true;
  let datesAdded = 0;
  try {
    const response = await api.get("/students/" + id + "/assignments", {
      params: {
        start_date: date.formatDate(startDate, "YYYY-MM-DD"),
        direction,
        limit: 4,
      },
    });
    if (response.data.assignments) {
      response.data.assignments.forEach((a) => {
        let date = assignments.value.get(a.deadline);
        if (date === undefined) {
          datesAdded += 1;
          date = [];
          assignments.value.set(a.deadline, date);
        }
        date.push(a);
      });
    }
    loading.value = false;
    return datesAdded;
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
