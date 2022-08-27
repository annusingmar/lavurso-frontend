<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-6 col-xs-10">
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div v-if="!archived" class="text-h4 q-mr-sm">
                {{ t("learning.journals") }}
              </div>
              <div v-else class="text-h4 q-mr-sm">
                {{ t("learning.archivedJournals") }}
              </div>
              <div class="q-gutter-x-md">
                <q-btn
                  :label="archivedButtonLabel"
                  color="secondary"
                  @click="toggleArchived"
                ></q-btn>
                <q-btn
                  v-if="!archived"
                  :label="t('new')"
                  to="/teacher/journals/new"
                  color="primary"
                ></q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-list v-if="journals && journals.length > 0" separator>
              <JournalListItem
                v-for="journal in journals"
                :key="journal.id"
                :journal="journal"
              ></JournalListItem>
            </q-list>
            <div v-else-if="!loading">{{ t("learning.noJournalsFound") }}</div>
          </q-card-section>
          <q-inner-loading :showing="loading"></q-inner-loading>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";
import JournalListItem from "src/components/JournalListItem.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const { id, role } = useUserStore();

const archived = ref(false);

const loading = ref(true);
const journals = ref([]);
const getJournals = async () => {
  journals.value = [];
  const endpoint =
    role === "admin"
      ? "/journals?archived=" + archived.value
      : "/teachers/" + id + "/journals?archived=" + archived.value;
  loading.value = true;
  try {
    const response = await api.get(endpoint);
    journals.value =
      response.data.journals !== null ? response.data.journals : [];
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

const toggleArchived = () => {
  archived.value = !archived.value;
  getJournals();
};

const archivedButtonLabel = computed(() =>
  archived.value ? t("learning.activeJournals") : t("learning.archivedJournals")
);

getJournals();
</script>
