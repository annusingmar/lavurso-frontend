<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div v-if="!isUpdateDialog" class="text-h5">
          {{ t("learning.lessons.createLesson") }}
        </div>
        <div v-else class="text-h5">{{ t("learning.lessons.editLesson") }}</div>
      </q-card-section>
      <q-card-section>
        <div class="q-gutter-y-md">
          <q-input
            filled
            readonly
            :model-value="formattedDate"
            :label="t('date')"
          >
            <template #append>
              <q-icon name="event" class="cursor-pointer">
                <q-tooltip>{{ t("pickADate") }}</q-tooltip>
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
            :label="t('description') + ' (' + t('optional') + ')'"
          ></q-input>
        </div>
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
import { useI18n } from "vue-i18n";
import { computed, ref, reactive } from "vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

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
  } catch (err) {
    console.log(err);
  }
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
    return t("pickADateRight");
  }
});

const saveButtonDisabled = computed(() => !lesson.date);

const saveLoading = ref(false);
const submitLesson = async () => {
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
      message: t("learning.lessons.savingLessonSucceeded"),
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
      message: t("learning.lessons.savingLessonFailed"),
      timeout: 5000,
    });
    saveLoading.value = false;
    throw new Error(error);
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
