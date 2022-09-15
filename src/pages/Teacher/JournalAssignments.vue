<template>
  <div class="row flex-center" style="min-height: 75vh">
    <div class="col-md-6 col-xs-10">
      <q-card>
        <q-card-section>
          <div class="row justify-between">
            <div class="text-h6">{{ t("learning.assignment_s") }}</div>
            <q-btn
              :label="t('new')"
              color="primary"
              @click="newAssignmentDialog"
            ></q-btn>
          </div>
        </q-card-section>
        <q-card-section>
          <q-list v-if="assignments.length > 0" separator>
            <JournalAssignmentListItem
              v-for="a in assignments"
              :key="a.id"
              :assignment="a"
              @refresh-assignments="getAssignments"
            ></JournalAssignmentListItem>
          </q-list>
          <div v-else-if="!loading">
            {{ t("learning.assignments.noAssignmentsFound") }}
          </div>
        </q-card-section>
        <q-inner-loading :showing="loading"></q-inner-loading>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import JournalAssignmentListItem from "src/components/JournalAssignmentListItem.vue";
import AssignmentDialog from "src/components/AssignmentDialog.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  id: {
    type: Number,
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

const newAssignmentDialog = () => {
  $q.dialog({
    component: AssignmentDialog,
    componentProps: {
      id: props.id,
    },
  }).onOk(getAssignments);
};

getAssignments();
</script>
