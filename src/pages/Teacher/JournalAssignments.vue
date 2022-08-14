<template>
  <div class="row flex-center" style="min-height: 75vh">
    <div class="col-md-6 col-sm-10">
      <q-card>
        <q-card-section>
          <div class="row justify-between">
            <div class="text-h6">Assignments</div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-list v-if="assignments.length > 0" separator>
            <JournalAssignmentListItem
              v-for="a in assignments"
              :key="a.id"
              :assignment="a"
            ></JournalAssignmentListItem>
          </q-list>
          <div v-else>No assignments found.</div>
        </q-card-section>
      </q-card>
      <q-inner-loading :showing="loading"></q-inner-loading>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import JournalAssignmentListItem from "src/components/JournalAssignmentListItem.vue";

const $q = useQuasar();
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
  archived: {
    type: Boolean,
    required: true,
  },
});

const assignments = ref([]);
const loading = ref(true);
const getAssignments = async () => {
  loading.value = true;
  try {
    const response = await api.get("/journals/" + props.id + "/assignments");
    assignments.value =
      response.data.assignments !== null ? response.data.assignments : [];
    loading.value = false;
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};
getAssignments();
</script>
