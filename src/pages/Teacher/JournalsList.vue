<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: 90vh">
      <div class="col-6">
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div class="text-h4">Journals</div>
              <q-btn
                label="new"
                to="/teacher/journals/new"
                color="primary"
              ></q-btn>
            </div>
          </q-card-section>
          <q-card-section>
            <q-list separator v-if="journals.length > 0">
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

<script>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import JournalListItem from "src/components/JournalListItem.vue";
import { useUserStore } from "src/stores/user";
import { ref } from "vue";
export default {
  name: "JournalsList",
  setup() {
    const $q = useQuasar();
    const { id, role } = storeToRefs(useUserStore());

    const loading = ref(true);
    const journals = ref([]);
    const getJournals = async () => {
      const endpoint =
        role.value === "admin" ? "/journals" : "/teachers/" + id + "/journals";
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

    getJournals();

    return {
      loading,
      journals,
    };
  },
  components: { JournalListItem },
};
</script>
