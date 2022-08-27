<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div v-if="!isUpdateDialog" class="text-h5">
          {{ t("learning.assignments.createAssignment") }}
        </div>
        <div v-else class="row justify-between items-center">
          <div class="text-h5">
            {{ t("learning.assignments.updateAssignment") }}
          </div>
          <q-btn
            color="negative"
            :label="t('delete')"
            :loading="deleteLoading"
            @click="deleteAssignmentPrompt"
          ></q-btn>
        </div>
      </q-card-section>
      <q-card-section class="q-gutter-y-md">
        <q-select
          v-model="assignment.type"
          filled
          :options="assignmentTypes"
          :label="t('learning.assignments.assignmentType')"
        ></q-select>
        <q-input
          filled
          readonly
          :model-value="formattedDate"
          :label="t('learning.assignments.deadline')"
        >
          <template #append>
            <q-icon name="event" class="cursor-pointer">
              <q-tooltip>{{ t("pickADate") }}</q-tooltip>
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
          :label="t('description')"
        ></q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          :label="t('save')"
          :loading="saveLoading"
          :disabled="saveButtonDisabled"
          @click="saveClicked"
        ></q-btn>
        <q-btn :label="t('cancel')" @click="cancelClicked"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar, date } from "quasar";
import { api } from "src/boot/axios";
import { computed, ref } from "vue";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

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
const deleteClicked = async () => {
  try {
    await deleteAssignment();
    onDialogOK();
  } catch {}
};

const popupRef = ref(null);

const assignment = ref({});
const assignmentTypes = [
  {
    label: t("learning.assignments.homework"),
    value: "homework",
  },
  {
    label: t("learning.assignments.test"),
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
      await api.patch("/assignments/" + props.existingAssignment.id, data);
    } else {
      await api.post("/assignments", data);
    }

    $q.notify({
      type: "positive",
      position: "top",
      message: t("learning.assignments.savingAssignmentSucceeded"),
      timeout: 3000,
    });
    saveLoading.value = false;
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("learning.assignments.savingAssignmentFailed"),
      timeout: 5000,
      actions: [{ label: t("dismiss"), color: "white" }],
    });
    saveLoading.value = false;
    throw new Error();
  }
};

const deleteLoading = ref(false);
const deleteAssignment = async () => {
  deleteLoading.value = true;
  try {
    await api.delete("/assignments/" + props.existingAssignment.id);
    $q.notify({
      type: "positive",
      position: "top",
      message: t("learning.assignments.deletingAssignmentSucceeded"),
      timeout: 3000,
    });
    deleteLoading.value = false;
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("learning.assignments.deletingAssignmentFailed"),
      timeout: 5000,
      actions: [{ label: t("dismiss"), color: "white" }],
    });
    deleteLoading.value = false;
    throw new Error();
  }
};

const deleteAssignmentPrompt = () => {
  $q.dialog({
    title: t("confirm"),
    message: t("learning.assignments.deletingAssignmentConfirm"),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteClicked();
  });
};

const isUpdateDialog = computed(() =>
  props.existingAssignment ? true : false
);

const formattedDate = computed(() => {
  if (assignment.value.deadline) {
    return date.formatDate(
      new Date(assignment.value.deadline),
      "DD. MMMM YYYY",
      $q.lang.date
    );
  } else {
    return t("pickADateRight");
  }
});

const futureDates = (calDate) =>
  date.getDateDiff(new Date(calDate), new Date().setHours(0, 0, 0, 0)) > 0
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
