<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-6 col-xs-10">
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div v-if="!archived" class="text-h4 q-mr-sm">
                Active Journals
              </div>
              <div v-else class="text-h4 q-mr-sm">Archived Journals</div>
              <div class="q-gutter-x-md">
                <q-btn
                  :label="archivedButtonLabel"
                  color="secondary"
                  @click="toggleArchived"
                ></q-btn>
                <q-btn
                  v-if="!archived"
                  label="new"
                  to="/teacher/journals/new"
                  color="primary"
                ></q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-list v-if="journals.length > 0" separator>
              <JournalListItem
                v-for="journal in journals"
                :key="journal.id"
                :journal="journal"
              ></JournalListItem>
            </q-list>
            <div v-else>No journals found.</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { computed, ref } from "vue";

import JournalListItem from "src/components/JournalListItem.vue";

const $q = useQuasar();
const { id, role } = storeToRefs(useUserStore());

const archived = ref(false);

const loading = ref(true);
const journals = ref([]);
const getJournals = async () => {
  const endpoint =
    role.value === "admin"
      ? "/journals?archived=" + archived.value
      : "/teachers/" + id.value + "/journals?archived=" + archived.value;
  loading.value = true;
  try {
    const response = await api.get(endpoint);
    journals.value =
      response.data.journals !== null ? response.data.journals : [];
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

const toggleArchived = () => {
  archived.value = !archived.value;
  getJournals();
};

const archivedButtonLabel = computed(() =>
  archived.value ? "Active Journals" : "Archived Journals"
);

getJournals();
</script>
