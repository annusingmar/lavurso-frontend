<template>
  <div class="row flex-center" style="min-height: 75vh">
    <div class="col-md-6 col-xs-10">
      <q-card>
        <q-card-section class="q-pb-none">
          <div class="text-h6">{{ t("learning.grade_s") }}</div>
          <div class="text-caption">
            {{ t("learning.marks.subjectGradesAddDescription") }}
            (<span class="text-weight-bold">{{
              journal.content.subject.name
            }}</span
            >)
          </div>
        </q-card-section>
        <q-form
          greedy
          autocorrect="off"
          autocapitalize="off"
          autocomplete="off"
          spellcheck="false"
          @submit.prevent="saveMarks"
          @reset="getData(false)"
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
        <q-inner-loading :showing="loading"></q-inner-loading>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref, watch, provide } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import StudentsMarksStudentItem from "src/components/StudentsMarksStudentItem.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  journal: {
    type: Object,
    required: true,
  },
});

const addMark = (i) => {
  if (!students.value[i].marks) {
    students.value[i].marks = [{}];
  } else {
    students.value[i].marks.push({});
  }
};

const loading = ref(true);
const students = ref([]);
const grades = ref([]);
provide("grades", grades);
const getData = async (fetchGrades) => {
  loading.value = true;
  try {
    if (fetchGrades) {
      const gradesResponse = await api.get("/grades");
      grades.value = gradesResponse.data.grades;
    }
    const response = await api.get(
      "/journals/" + props.journal.content.id + "/subject" + "/marks"
    );
    students.value = response.data.students;
    students.value.forEach((_, i) => {
      if (!students.value[i].marks || students.value[i].marks.length === 0) {
        addMark(i);
      }
    });
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

const saving = ref(false);
const saveMarks = async () => {
  try {
    const send = students.value.map((s) => {
      return {
        student_id: s.id,
        marks: s.marks.flatMap((m) => {
          if (!m.grade || m.grade.trim() === "") {
            if (m.id) {
              return [{ id: m.id, remove: true }];
            } else {
              return [];
            }
          } else {
            return [
              {
                ...m,
                grade: grades.value.find((g) => g.identifier === m.grade).id,
              },
            ];
          }
        }),
      };
    });
    await api.patch(
      "/journals/" + props.journal.content.id + "/subject" + "/marks",
      send
    );
    $q.notify({
      type: "positive",
      position: "top",
      message: t("savingSucceeded"),
      timeout: 3000,
    });
    saving.value = false;
    getData(false);
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

watch(props, () => getData(true), { immediate: true });
</script>
