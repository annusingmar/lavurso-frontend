<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div v-if="!isUpdateDialog" class="text-h5">Create Assignment</div>
        <div v-else class="text-h5">Update Assignment</div>
      </q-card-section>
      <q-card-section class="q-gutter-y-md">
        <q-select
          v-model="assignment.type"
          filled
          :options="assignmentTypes"
          label="Assignment Type"
        ></q-select>
        <q-input filled readonly :model-value="formattedDate" label="Deadline">
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-tooltip>Pick a date</q-tooltip>
              <q-popup-proxy ref="popupRef" cover>
                <q-date
                  v-model="assignment.deadline"
                  mask="YYYY-MM-DD"
                  first-day-of-week="1"
                  :options="futureDates"
                  minimal
                  no-unset
                  @update:model-value="popupRef.hide"
                ></q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
        <q-input
          v-model="assignment.description"
          filled
          autogrow
          label="Description"
        ></q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="Save"
          :loading="saveLoading"
          :disabled="saveButtonDisabled"
          @click="saveClicked"
        ></q-btn>
        <q-btn label="cancel" @click="cancelClicked"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar, date } from "quasar";
import { api } from "src/boot/axios";
import { computed, ref } from "vue";

const $q = useQuasar();

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps({
  id: {
    type: Number,
    required: false,
    default: null,
  },
  existingAssignment: {
    type: Object,
    required: false,
    default: null,
  },
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const cancelClicked = onDialogCancel;
const saveClicked = async () => {
  try {
    await submitAssignment();
    onDialogOK();
  } catch {}
};

const popupRef = ref(null);

const assignment = ref({});
const assignmentTypes = [
  {
    label: "Homework",
    value: "homework",
  },
  {
    label: "Test",
    value: "test",
  },
];

const saveLoading = ref(false);
const submitAssignment = async () => {
  saveLoading.value = true;

  let data = {
    description: assignment.value.description,
    deadline: assignment.value.deadline,
    type: assignment.value.type.value,
  };

  if (!isUpdateDialog.value) {
    data.journal_id = props.id;
  }

  try {
    if (isUpdateDialog.value) {
      api.patch("/assignments/" + props.existingAssignment.id, data);
    } else {
      api.post("/assignments", data);
    }

    $q.notify({
      type: "positive",
      position: "top",
      message: "Saving assignment succeeded",
      timeout: 3000,
    });
    saveLoading.value = false;
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Saving assignment failed",
      timeout: 5000,
      actions: [{ label: "Dismiss", color: "white" }],
    });
    saveLoading.value = false;
    throw new Error();
  }
};

const isUpdateDialog = computed(() =>
  props.existingAssignment ? true : false
);

const formattedDate = computed(() => {
  if (assignment.value.deadline) {
    return date.formatDate(
      new Date(assignment.value.deadline),
      "DD. MMMM YYYY"
    );
  } else {
    return "Pick a date by clicking to the right";
  }
});

const futureDates = (calDate) =>
  date.getDateDiff(new Date(calDate), new Date().setHours(0, 0, 0, 0)) >= 0
    ? true
    : false;

const saveButtonDisabled = computed(
  () =>
    !(
      assignment.value.type &&
      assignment.value.deadline &&
      assignment.value.description
    )
);

const initialData = () => {
  assignment.value.type = assignmentTypes.find(
    (t) => t.value == props.existingAssignment.type
  );
  assignment.value.description = props.existingAssignment.description;
  assignment.value.deadline = props.existingAssignment.deadline;
};

if (isUpdateDialog.value) {
  initialData();
}
</script>
