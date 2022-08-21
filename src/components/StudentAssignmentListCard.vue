<template>
  <q-card>
    <q-card-section class="q-pb-none">
      <div class="text-h6">Assignments</div>
      <div class="row justify-end items-center">
        <q-btn dense size="sm" label="show older" @click="showOlder"></q-btn>
      </div>
    </q-card-section>
    <q-card-section class="q-gutter-y-sm">
      <StudentAssignmentListDayItem
        v-for="(item, key) in assignments"
        :id="id"
        :key="key"
        :date="key"
        :assignments="item"
      />
      <div class="row justify-end items-center">
        <q-btn dense size="sm" label="show future" @click="showFuture"></q-btn>
      </div>
    </q-card-section>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-card>
</template>

<script setup>
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { reactive, ref } from "vue";
import { useQuasar, date } from "quasar";
import StudentAssignmentListDayItem from "./StudentAssignmentListDayItem.vue";

const $q = useQuasar();
const { id } = useUserStore();

const startDate = ref(new Date());
const endDate = ref(date.addToDate(startDate.value, { days: 5 }));

const showOlder = () => {
  startDate.value = date.subtractFromDate(startDate.value, { days: 5 });
  getAssignments();
};

const showFuture = () => {
  endDate.value = date.addToDate(endDate.value, { days: 5 });
  getAssignments();
};

const loading = ref(true);
const assignments = ref({});
const getAssignments = async () => {
  loading.value = true;
  assignments.value = {};
  try {
    const response = await api.get("/students/" + id + "/assignments", {
      params: {
        start_date: date.formatDate(startDate.value, "YYYY-MM-DD"),
        end_date: date.formatDate(endDate.value, "YYYY-MM-DD"),
      },
    });
    for (
      let c = new Date(startDate.value);
      c <= endDate.value;
      c = date.addToDate(c, { days: 1 })
    ) {
      assignments.value[date.formatDate(c, "YYYY-MM-DD")] = [];
    }
    if (response.data.assignments) {
      response.data.assignments.forEach((a) =>
        assignments.value[a.deadline].push(a)
      );
    }
    loading.value = false;
  } catch (error) {
    console.log(error);
  }
};

getAssignments();
</script>
