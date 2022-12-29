<template>
  <q-item>
    <q-item-section avatar>
      <MarkIcon
        :mark="mark"
        :editable="false"
        :extra-info="false"
        :show-lesson="false"
      ></MarkIcon>
    </q-item-section>
    <q-item-section>
      <div class="row justify-between q-item__label">
        <q-item-label class="text-weight-bold">{{ displayType }}</q-item-label>
        <q-item-label caption>{{ mark.teacher.name }}</q-item-label>
      </div>
      <q-item-label v-if="mark.comment" style="white-space: pre">{{
        mark.comment
      }}</q-item-label>
      <q-item-label v-if="lessonDescription" style="white-space: pre" caption>{{
        lessonDescription
      }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import MarkIcon from "./MarkIcon.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  mark: {
    type: Object,
    required: true,
  },
});

const lessonDate = computed(() => {
  if (props.mark.lesson) {
    const jsDate = new Date(props.mark.lesson.date);
    return date.formatDate(jsDate, "DD. MMMM YYYY", $q.lang.date);
  } else {
    return null;
  }
});

const lessonDescription = computed(() => {
  if (props.mark.lesson && props.mark.lesson.description) {
    return lessonDate.value + "\n" + props.mark.lesson.description;
  } else if (props.mark.lesson) {
    return lessonDate.value;
  } else {
    return null;
  }
});

const displayType = computed(() => {
  switch (props.mark.type) {
    case "lesson_grade":
      return t("learning.marks.lessonGrade");
    case "course_grade":
      return `${t("learning.marks.courseGrade")} (${props.mark.course}. ${t(
        "learning.course"
      )})`;
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
</script>
