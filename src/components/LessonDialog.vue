<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div v-if="!isUpdateDialog" class="text-h5">Create Lesson</div>
        <div v-else class="text-h5">Update Lesson</div>
      </q-card-section>
      <q-card-section>
        <div class="q-gutter-y-md">
          <q-input filled readonly :model-value="formattedDate" label="Date">
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-tooltip>Pick a date</q-tooltip>
                <q-popup-proxy ref="popupRef" cover>
                  <q-date
                    v-model="lesson.date"
                    mask="YYYY-MM-DD"
                    first-day-of-week="1"
                    minimal
                    no-unset
                    @update:model-value="popupRef.hide"
                  ></q-date>
                </q-popup-proxy>
              </q-icon>
            </template>
          </q-input>
          <q-input
            v-model="lesson.description"
            filled
            autogrow
            label="Description (optional)"
          ></q-input>
        </div>
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
import { computed, ref, reactive } from "vue";

const $q = useQuasar();

const props = defineProps({
  course: {
    type: Number,
    required: false,
    default: null,
  },
  journal: {
    type: Object,
    required: false,
    default: null,
  },
  existingLesson: {
    type: Object,
    required: false,
    default: null,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const cancelClicked = onDialogCancel;

const saveClicked = async () => {
  try {
    await submitLesson();
    onDialogOK();
  } catch {}
};

const lesson = reactive({});

const popupRef = ref(null);
const formattedDate = computed(() => {
  if (lesson.date) {
    return date.formatDate(
      new Date(lesson.date),
      "DD. MMMM YYYY",
      $q.lang.date
    );
  } else {
    return "Pick a date by clicking to the right";
  }
});

const saveButtonDisabled = computed(() => !lesson.date);

const saveLoading = ref(false);
const submitLesson = async () => {
  if (!lesson.date) {
    dateError.value = true;
    throw new Error();
  }
  let data = {};
  if (!isUpdateDialog.value) {
    data.journal_id = props.journal.id;
    data.course = props.course;
  }
  data.date = lesson.date;
  data.description = lesson.description;
  saveLoading.value = true;
  try {
    if (!isUpdateDialog.value) {
      await api.post("/lessons", data);
    } else {
      await api.patch("/lessons/" + props.existingLesson.id, data);
    }
    $q.notify({
      type: "positive",
      position: "top",
      message: "Saving lesson succeeded",
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
      message: "Saving lesson failed",
      timeout: 5000,
      actions: [{ label: "Dismiss", color: "white" }],
    });
    saveLoading.value = false;
    throw new Error();
  }
};

// editing a lesson

const isUpdateDialog = computed(() => (props.existingLesson ? true : false));

const initialData = () => {
  lesson.date = props.existingLesson.date;
  lesson.description = props.existingLesson.description;
};

if (isUpdateDialog.value) {
  initialData();
}
</script>
