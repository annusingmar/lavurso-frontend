<template>
  <q-card>
    <q-card-section>
      <div class="text-subtitle1">{{ markDisplayType }}</div>

      <q-separator />

      <div class="row justify-between q-mt-sm">
        <span class="q-mr-sm">Teacher</span>
        <span>{{ mark.by.name }}</span>
      </div>

      <div class="row justify-between">
        <span class="q-mr-sm">Added</span>
        <span>{{ createdAt }}</span>
      </div>

      <div v-if="hasBeenEdited" class="row justify-between">
        <span class="q-mr-sm">Edited</span>
        <span>{{ updatedAt }}</span>
      </div>

      <div v-if="mark.comment && mark.comment.trim() !== ''">
        <div>Comment:</div>
        <div>
          <q-field filled dense readonly>
            <template #control>
              <div style="white-space: pre">
                {{ mark.comment }}
              </div>
            </template>
          </q-field>
        </div>
      </div>

      <q-expansion-item v-if="lessonDate && showLesson" dense label="Lesson">
        <div class="row justify-between">
          <span class="q-mr-sm">Date</span>
          <span>{{ lessonDate }}</span>
        </div>
        <div
          v-if="
            mark.lesson.description && mark.lesson.description.trim() !== ''
          "
        >
          <div>Description:</div>
          <div>
            <q-field filled dense readonly>
              <template #control>
                <div style="white-space: pre">
                  {{ mark.lesson.description }}
                </div>
              </template>
            </q-field>
          </div>
        </div>
      </q-expansion-item>

      <q-expansion-item
        v-if="mark.excuse && mark.excuse.mark_id"
        dense
        label="Excuse"
      >
        <q-field filled dense readonly>
          <template #control>
            <div style="white-space: pre">
              {{ mark.excuse.excuse }}
            </div>
          </template>
        </q-field>
        <div class="row justify-between q-mt-sm">
          <span class="q-mr-sm">By</span>
          <span>{{ mark.excuse.by.name }}</span>
        </div>
        <div class="row justify-between">
          <span class="q-mr-sm">At</span>
          <span>{{ excusedAt }}</span>
        </div>

        <q-btn
          color="negative"
          label="remove excuse"
          class="q-mt-sm"
          style="width: 100%"
          @click="removeExcusePrompt"
        ></q-btn>
      </q-expansion-item>
      <q-btn
        v-else-if="mark.type === 'absent'"
        color="primary"
        label="excuse"
        class="q-mt-sm"
        style="width: 100%"
        rounded
        dense
        @click="excuseAbsenceDialog"
      ></q-btn>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { computed } from "vue";

const $q = useQuasar();

const props = defineProps({
  mark: {
    type: Object,
    required: true,
  },
  showLesson: {
    type: Boolean,
    required: true,
  },
});

const emit = defineEmits(["refreshAbove"]);

const createdAt = computed(() => {
  return date.formatDate(props.mark.created_at, "DD. MMM YYYY HH:mm");
});

const updatedAt = computed(() => {
  return date.formatDate(props.mark.updated_at, "DD. MMM YYYY HH:mm");
});

const hasBeenEdited = computed(() =>
  date.getDateDiff(
    new Date(props.mark.updated_at),
    new Date(props.mark.created_at),
    "seconds"
  )
);

const lessonDate = computed(() =>
  props.mark.lesson && props.mark.lesson.id
    ? date.formatDate(new Date(props.mark.lesson.date), "DD. MMM YYYY")
    : null
);

const excusedAt = computed(() =>
  props.mark.excuse && props.mark.excuse.mark_id
    ? date.formatDate(props.mark.excuse.at, "DD. MMM YYYY HH:mm")
    : null
);

const markDisplayType = computed(() => {
  switch (props.mark.type) {
    case "lesson_grade":
      return "Lesson Grade";
    case "course_grade":
      return "Course Grade";
    case "subject_grade":
      return "Subject Grade";
    case "not_done":
      return "Not Done";
    case "notice_good":
      return "Notice (Good)";
    case "notice_neutral":
      return "Notice (Neutral)";
    case "notice_bad":
      return "Notice (Bad)";
    case "absent":
      return "Absent";
    case "late":
      return "Late";
    default:
      return null;
  }
});

const excuseAbsence = async (excuse) => {
  try {
    await api.post("/absences/" + props.mark.id + "/excuse", {
      excuse,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: "Excusing absence succeeded",
      timeout: 3000,
    });
    emit("refreshAbove");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: "Excusing absence failed",
      timeout: 5000,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};

const excuseAbsenceDialog = () => {
  $q.dialog({
    title: "Excuse absence",
    prompt: {
      model: "",
      isValid: (val) => val.trim() !== "",
      type: "text",
    },
    cancel: true,
  }).onOk((data) => excuseAbsence(data));
};

const removeExcuse = async () => {
  try {
    await api.delete("/absences/" + props.mark.id + "/excuse");
    $q.notify({
      type: "positive",
      position: "top",
      message: "Deleting excuse succeeded",
      timeout: 3000,
    });
    emit("refreshAbove");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: "Deleting excuse failed",
      timeout: 5000,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};

const removeExcusePrompt = () => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to remove this excuse?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    removeExcuse();
  });
};
</script>
