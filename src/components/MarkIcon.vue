<template>
  <div>
    <div
      v-if="icon !== ''"
      class="mark"
      :class="[mark.type, { clickable: editable }]"
      @click="editMark"
    >
      <q-icon :name="icon" size="sm"></q-icon>
    </div>
    <span
      v-else
      class="mark"
      :class="[mark.type, { 'bad-grade': isBadGrade }, { clickable: editable }]"
      @click="editMark"
      >{{ mark.grade.identifier }}</span
    >
    <q-tooltip
      v-if="tooltip !== ''"
      class="mark text-center"
      style="white-space: pre-wrap"
    >
      {{ tooltip }}
    </q-tooltip>
  </div>
</template>

<script setup>
import { useQuasar, date } from "quasar";
import { computed } from "vue";
import MarkDialog from "./MarkDialog.vue";

const $q = useQuasar();

const props = defineProps({
  mark: {
    type: Object,
    required: true,
  },
  editable: {
    type: Boolean,
    required: true,
  },
  extraInfo: {
    type: Boolean,
    required: false,
    default: false,
  },
});
const emit = defineEmits(["refreshAbove"]);

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

  if (props.extraInfo) {
    if (props.mark.type === "lesson_grade") {
      tt +=
        "\n" +
        date.formatDate(new Date(props.mark.lesson.date), "DD MMMM YYYY");
      if (
        props.mark.lesson.description &&
        props.mark.lesson.description.trim() != ""
      ) {
        tt += "\n" + props.mark.lesson.description;
      }
    } else if (props.mark.type === "course_grade") {
      tt += "\n" + props.mark.course + ". course";
    }
  }

  if (props.mark.comment && props.mark.comment.trim() !== "") {
    tt += "\n" + props.mark.comment;
  }
  return tt;
});

const editMark = () => {
  if (props.editable) {
    $q.dialog({
      component: MarkDialog,
      componentProps: {
        existingMark: props.mark,
      },
    }).onOk(() => {
      emit("refreshAbove");
    });
  }
};
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

.clickable {
  cursor: pointer;
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
.subject_grade {
  border: $border rgb(35, 112, 189);
  background: rgba(35, 112, 189, 0.25);
}

.course_grade {
  border: $border rgb(124, 0, 207);
  background: rgba(124, 0, 207, 0.25);
}

.subject_grade {
  border: $border rgb(0, 105, 18);
  background: rgb(0, 105, 18, 0.25);
}

.notice_good {
  border: $border rgb(33, 186, 69);
  background: rgba(33, 186, 69, 0.25);
}

.bad-grade {
  color: red;
}
</style>
