<template>
  <q-page>
    <div
      class="row flex-center q-py-lg q-col-gutter-md"
      style="min-height: inherit; align-content: center"
    >
      <div class="col-md-8 col-xs-10">
        <LessonDetailInfo
          v-if="lesson && lesson.id"
          :lesson="lesson"
          @refresh-lesson="getData(true, false, false)"
        ></LessonDetailInfo>
      </div>
      <div class="col-md-8 col-xs-10">
        <q-card>
          <q-form
            greedy
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
            @submit.prevent="saveMarks"
            @reset="getData(false, false, true)"
          >
            <q-card-section>
              <div
                v-if="students && students.length > 0"
                class="q-gutter-y-sm q-mx-sm"
              >
                <StudentsMarksStudentItem
                  v-for="(s, i) in students"
                  :key="s.id"
                  :model-value="students[i]"
                  :separator="i != students.length - 1"
                  @update-toggle="
                    (field, val) => (students[i].lesson[field] = val)
                  "
                  @add-mark="addMark(i)"
                  @update-mark="
                    (mi, field, val) => (students[i].marks[mi][field] = val)
                  "
                ></StudentsMarksStudentItem>
              </div>
              <div v-else-if="!loading">
                {{ t("learning.noStudentsInJournal") }}
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <div class="row justify-end q-gutter-x-md">
                <q-btn :label="t('cancel')" type="reset"></q-btn>
                <q-btn
                  :label="t('save')"
                  color="primary"
                  type="submit"
                  :loading="saving"
                ></q-btn>
              </div>
            </q-card-section>
          </q-form>
        </q-card>
      </div>
    </div>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, provide } from "vue";
import { useI18n } from "vue-i18n";
import LessonDetailInfo from "src/components/LessonDetailInfo.vue";
import StudentsMarksStudentItem from "src/components/StudentsMarksStudentItem.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const loading = ref(true);
const saving = ref(false);
const lesson = ref({});
const grades = ref([]);
provide("grades", grades);
const students = ref([]);

const addMark = (i) => {
  if (!students.value[i].marks) {
    students.value[i].marks = [{ type: "grade" }];
  } else {
    students.value[i].marks.push({ type: "grade" });
  }
};

const getData = async (fetchLesson, fetchGrades, fetchMarks) => {
  loading.value = true;
  try {
    if (fetchLesson) {
      const lessonResponse = await api.get("/lessons/" + props.id);
      lesson.value = lessonResponse.data.lesson;
    }
    if (fetchGrades) {
      const gradesResponse = await api.get("/grades");
      grades.value = gradesResponse.data.grades;
    }
    if (fetchMarks) {
      const studentsResponse = await api.get("/lessons/" + props.id + "/marks");
      students.value =
        studentsResponse.data.students !== null
          ? studentsResponse.data.students
          : [];
      students.value.forEach((_, i) => {
        if (!students.value[i].marks || students.value[i].marks.length === 0) {
          addMark(i);
        }
      });
    }
    loading.value = false;
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("dataLoadingFail"),
      timeout: 0,
      actions: [{ label: t("dismiss"), color: "white" }],
    });
  }
};

const saveMarks = async () => {
  try {
    const send = students.value.map((s) => {
      return {
        student_id: s.id,
        absent: s.lesson.absent,
        late: s.lesson.late,
        not_done: s.lesson.not_done,
        marks: s.marks.flatMap((m) => {
          if (
            (m.type !== "grade" && (!m.comment || m.comment.trim() === "")) ||
            (m.type === "grade" && (!m.grade || m.grade.trim() === ""))
          ) {
            if (m.id) {
              return [{ id: m.id, remove: true }];
            } else {
              return [];
            }
          } else {
            if (m.type === "grade") {
              return [
                {
                  ...m,
                  grade: grades.value.find((g) => g.identifier === m.grade).id,
                },
              ];
            } else {
              return [{ ...m, grade: null }];
            }
          }
        }),
      };
    });
    await api.patch("/lessons/" + props.id + "/marks", send);
    $q.notify({
      type: "positive",
      position: "top",
      message: t("savingSucceeded"),
      timeout: 3000,
    });
    saving.value = false;
    getData(false, false, true);
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("savingFailed"),
      timeout: 6000,
    });
    saving.value = false;
  }
};

getData(true, true, true);
</script>
