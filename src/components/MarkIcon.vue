<template>
  <div>
    <div class="mark" :class="props.mark.type" v-if="icon !== ''">
      <q-icon :name="icon" size="sm"></q-icon>
    </div>
    <span
      class="mark"
      :class="[props.mark.type, { 'bad-grade': isBadGrade }]"
      v-else
      >{{ props.mark.grade.identifier }}</span
    >
    <q-tooltip
      class="mark text-center"
      style="white-space: pre-wrap"
      v-if="tooltip !== ''"
    >
      {{ tooltip }}
    </q-tooltip>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps(["mark"]);

const icon = computed(() => {
  switch (props.mark.type) {
    case "absent":
      return "chair_alt";
    case "late":
      return "schedule";
    case "not_done":
      return "turned_in_not";
    case "notice_good":
    case "notice_neutral":
    case "notice_bad":
      return "message";
    default:
      return "";
  }
});

const isBadGrade = computed(() => {
  if (props.mark.grade && props.mark.grade.value) {
    if (props.mark.grade.value <= 50) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
});

const tooltip = computed(() => {
  let tt = "";
  switch (props.mark.type) {
    case "lesson_grade":
      tt = "Lesson Grade";
      break;
    case "course_grade":
      tt = "Course Grade";
      break;
    case "subject_grade":
      tt = "Subject Grade";
      break;
    case "not_done":
      tt = "Not Done";
      break;
    case "notice_good":
      tt = "Notice (Good)";
      break;
    case "notice_neutral":
      tt = "Notice (Neutral)";
      break;
    case "notice_bad":
      tt = "Notice (Bad)";
      break;
    case "absent":
      tt = "Absent";
      break;
    case "late":
      tt = "Late";
      break;
  }

  if (props.mark.comment && props.mark.comment.trim() !== "") {
    tt += "\n" + props.mark.comment;
  }
  return tt;
});

console.log(icon.value, isBadGrade.value, tooltip.value);
</script>

<style scoped lang="scss">
$border: 2px solid;

.mark {
  width: 40px;
  height: 35px;
  padding: 5px;
  font-weight: bold;
  display: inline-flex;
  justify-content: center;
  align-items: center;
}

.absent,
.notice_bad,
.not_done {
  border: $border red;
  background: rgba(255, 0, 0, 0.25);
}

.late {
  border: $border rgb(242, 192, 55);
  background: rgba(242, 192, 55, 0.25);
}

.notice_neutral,
.lesson_grade,
.course_grade,
.subject_grade {
  border: $border rgb(35, 112, 189);
  background: rgba(35, 112, 189, 0.25);
}

.notice_good {
  border: $border rgb(33, 186, 69);
  background: rgba(33, 186, 69, 0.25);
}

.bad-grade {
  color: red;
}
</style>
