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
    </q-card-section>
  </q-card>
</template>

<script setup>
import { date } from "quasar";
import { computed } from "vue";

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
</script>
