import { i18n } from "../boot/i18n";
const { t } = i18n.global;

export function useMarkLabel(mark) {
  switch (mark.type) {
    case "lesson_grade":
      return t("learning.marks.grade");
    case "course_grade":
      return `${t("learning.marks.courseGrade")} (${mark.course}. ${t(
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
}
