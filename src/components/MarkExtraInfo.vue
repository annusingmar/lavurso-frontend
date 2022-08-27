<template>
  <q-card>
    <q-card-section>
      <div class="text-subtitle1">{{ markDisplayType }}</div>

      <q-separator />

      <div class="row justify-between q-mt-sm">
        <span class="q-mr-sm">{{ t("learning.teacher") }}</span>
        <span>{{ mark.by.name }}</span>
      </div>

      <div class="row justify-between">
        <span class="q-mr-sm">{{ t("added") }}</span>
        <span>{{ createdAt }}</span>
      </div>

      <div v-if="hasBeenEdited" class="row justify-between">
        <span class="q-mr-sm">{{ t("edited") }}</span>
        <span>{{ updatedAt }}</span>
      </div>

      <div v-if="mark.comment && mark.comment.trim() !== ''">
        <div>{{ t("learning.comment") }}:</div>
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

      <q-expansion-item
        v-if="lessonDate && showLesson"
        dense
        :label="t('learning.lesson')"
      >
        <div class="row justify-between">
          <span class="q-mr-sm">{{ t("date") }}</span>
          <span>{{ lessonDate }}</span>
        </div>
        <div
          v-if="
            mark.lesson.description && mark.lesson.description.trim() !== ''
          "
        >
          <div>{{ t("description") }}:</div>
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
        :label="t('learning.excuse')"
      >
        <q-field filled dense readonly>
          <template #control>
            <div style="white-space: pre">
              {{ mark.excuse.excuse }}
            </div>
          </template>
        </q-field>
        <div class="row justify-between q-mt-sm">
          <span class="q-mr-sm">{{ t("learning.excuser") }}</span>
          <span>{{ mark.excuse.by.name }}</span>
        </div>
        <div class="row justify-between">
          <span class="q-mr-sm">{{ t("date") }}</span>
          <span>{{ excusedAt }}</span>
        </div>

        <q-btn
          v-if="canExcuse"
          color="negative"
          :label="t('learning.removeExcuse')"
          class="q-mt-sm"
          style="width: 100%"
          @click="removeExcusePrompt"
        ></q-btn>
      </q-expansion-item>
      <q-btn
        v-else-if="mark.type === 'absent' && canExcuse"
        color="primary"
        :label="t('learning.excuseAbsence')"
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
import { useUserStore } from "src/stores/user";
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { t } = useI18n({ useScope: "global" });
const { role } = useUserStore();

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
  return date.formatDate(
    props.mark.created_at,
    "DD. MMM YYYY HH:mm",
    $q.lang.date
  );
});

const updatedAt = computed(() => {
  return date.formatDate(
    props.mark.updated_at,
    "DD. MMM YYYY HH:mm",
    $q.lang.date
  );
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
    ? date.formatDate(
        new Date(props.mark.lesson.date),
        "DD. MMM YYYY",
        $q.lang.date
      )
    : null
);

const excusedAt = computed(() =>
  props.mark.excuse && props.mark.excuse.mark_id
    ? date.formatDate(props.mark.excuse.at, "DD. MMM YYYY HH:mm", $q.lang.date)
    : null
);

const markDisplayType = computed(() => {
  switch (props.mark.type) {
    case "lesson_grade":
      return t("learning.marks.lessonGrade");
    case "course_grade":
      return t("learning.marks.courseGrade");
    case "subject_grade":
      return t("learning.marks.subjectGrade");
    case "not_done":
      return t("learning.marks.notDone");
    case "notice_good":
      return t("learning.marks.noticeGood");
    case "notice_neutral":
      return t("learning.marks.noticeNeutral");
    case "notice_bad":
      return t("learning.marks.noticeBad");
    case "absent":
      return t("learning.marks.absent");
    case "late":
      return t("learning.marks.late");
    default:
      return null;
  }
});

const canExcuse = computed(() => role === "teacher" || role === "parent");

const excuseAbsence = async (excuse) => {
  try {
    await api.post("/absences/" + props.mark.id + "/excuse", {
      excuse,
    });
    emit("refreshAbove");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("learning.excusingAbsenceFailed"),
      timeout: 5000,
      actions: [{ label: t("dismiss"), color: "white" }],
    });
  }
};

const excuseAbsenceDialog = () => {
  $q.dialog({
    title: t("learning.excuseAbsence"),
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
    emit("refreshAbove");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("learning.removingExcuseFailed"),
      timeout: 5000,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};

const removeExcusePrompt = () => {
  $q.dialog({
    title: t("confirm"),
    message: t("learning.removingExcuseConfirm"),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    removeExcuse();
  });
};
</script>
