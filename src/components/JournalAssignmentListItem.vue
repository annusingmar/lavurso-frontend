<template>
  <q-item
    v-ripple
    clickable
    :disable="oldAssignment"
    @click="editAssignmentDialog"
  >
    <q-item-section>
      <div class="row q-gutter-x-sm">
        <q-badge
          v-if="assignment.type === 'test'"
          color="orange"
          :label="t('learning.assignments.test_label')"
        ></q-badge>
        <q-badge
          v-else
          color="blue"
          :label="t('learning.assignments.homework_label')"
        ></q-badge>
        <q-item-label>
          {{ deadline }}
        </q-item-label>
      </div>
      <q-item-label :lines="1" class="q-mt-sm">{{
        assignment.description
      }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from "vue";
import { date, useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import AssignmentDialog from "./AssignmentDialog.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  assignment: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["refreshAssignments"]);

const deadline = computed(() => {
  const deadlineDate = new Date(props.assignment.deadline);
  let formattedDate = date.formatDate(
    deadlineDate,
    "DD. MMMM YYYY",
    $q.lang.date
  );
  if (date.isSameDate(new Date(), deadlineDate, "date")) {
    formattedDate += ` (${t("today")})`;
  }
  return formattedDate;
});

const oldAssignment = computed(
  () =>
    date.getDateDiff(new Date(props.assignment.deadline), new Date(), "days") <
    1
);

const editAssignmentDialog = (evt, go) => {
  console.log(evt, go);
  $q.dialog({
    component: AssignmentDialog,
    componentProps: {
      existingAssignment: props.assignment,
    },
  }).onOk(() => emit("refreshAssignments"));
};
</script>
