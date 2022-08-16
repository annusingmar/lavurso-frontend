<template>
  <div class="row flex-center" style="min-height: 75vh">
    <div class="col-md-6 col-sm-10">
      <div v-if="!loading && journals.length > 0" class="q-gutter-y-md">
        <StudentJournalMarksItem
          v-for="j in journals"
          :key="j.id"
          :journal="j"
        ></StudentJournalMarksItem>
      </div>
      <q-card v-else-if="!loading">
        <div>No journals found</div>
      </q-card>
      <q-inner-loading :showing="loading"></q-inner-loading>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import StudentJournalMarksItem from "src/components/StudentJournalMarksItem.vue";

const $q = useQuasar();
const router = useRouter();
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const loading = ref(true);
const journals = ref([]);
const getJournals = async () => {
  loading.value = true;
  try {
    const response = await api.get("/students/" + props.id + "/marks");
    journals.value =
      response.data.journals !== null ? response.data.journals : [];
    loading.value = false;
  } catch (error) {
    if (error.response && error.response.status == 404) {
      router.replace("/not-found");
    } else if (error.response && error.response.status == 403) {
      router.replace("/access-denied");
    } else {
      $q.notify({
        type: "negative",
        position: "top",
        message: "Loading of data failed",
        timeout: 0,
        actions: [{ label: "Dismiss", color: "white" }],
      });
    }
  }
};
getJournals();
</script>
