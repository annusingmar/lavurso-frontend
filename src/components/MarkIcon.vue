<template>
  <div :class="{ clickable: editable || extraInfo }">
    <div v-if="icon !== ''" class="mark" :class="markType" @click="editMark">
      <q-icon :name="icon" size="sm"></q-icon>
    </div>
    <span
      v-else
      class="mark"
      :class="[markType, { 'bad-grade': isBadGrade }]"
      @click="editMark"
      >{{ mark.grade.identifier }}</span
    >
    <q-popup-proxy v-if="!editable && extraInfo">
      <MarkExtraInfo
        :mark="mark"
        :show-lesson="showLesson"
        @refresh-above="emit('refreshAbove')"
      ></MarkExtraInfo>
    </q-popup-proxy>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { computed } from "vue";
import MarkDialog from "./MarkDialog.vue";
import MarkExtraInfo from "./MarkExtraInfo.vue";

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
  showLesson: {
    type: Boolean,
    required: false,
    default: true,
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

const markType = computed(() => {
  switch (props.mark.type) {
    case "absent":
      if (props.mark.excuse && props.mark.excuse.mark_id) {
        return "absent-excused";
      } else {
        return "absent";
      }
    default:
      return props.mark.type;
  }
});

const isBadGrade = computed(() => {
  if (props.mark.grade && props.mark.grade.value) {
    if (props.mark.grade.value < 50) {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
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

.absent-excused,
.notice_good {
  border: $border rgb(33, 186, 69);
  background: rgba(33, 186, 69, 0.25);
}

.bad-grade {
  color: red;
}
</style>
