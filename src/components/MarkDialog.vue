<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div v-if="!isUpdateDialog" class="text-h5">
          {{ t("learning.marks.addAMark") }}
        </div>
        <div v-else class="row justify-between items-center">
          <div class="text-h5">{{ t("learning.marks.updateMark") }}</div>
          <q-btn
            color="negative"
            :label="t('delete')"
            :loading="deleteLoading"
            @click="deleteMarkPrompt"
          ></q-btn>
        </div>
      </q-card-section>
      <q-card-section>
        <div class="q-gutter-y-xs">
          <q-select
            ref="typeRef"
            v-model="mark.type"
            filled
            :options="markTypes"
            :label="t('learning.marks.markType')"
            :rules="[(val) => val || t('mandatoryField')]"
            :disable="
              isUpdateDialog ||
              props.type === 'course' ||
              props.type === 'subject'
            "
          ></q-select>
          <q-select
            v-if="mark.type && mark.type.value === 'grade'"
            ref="gradeRef"
            v-model="mark.grade"
            filled
            :options="grades"
            :label="t('learning.marks.grade')"
            option-value="id"
            option-label="identifier"
            :rules="[(val) => val || t('mandatoryField')]"
            @filter="gradeFilter"
          ></q-select>
          <q-input
            v-model="mark.comment"
            filled
            autogrow
            :label="t('learning.marks.commentOptional')"
          ></q-input>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          :label="t('save')"
          :loading="saveLoading"
          @click="saveClicked"
        ></q-btn>
        <q-btn :label="t('cancel')" @click="cancelClicked"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useI18n } from "vue-i18n";
import { computed, reactive, ref } from "vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  student: {
    type: Object,
    required: false,
    default: null,
  },
  type: {
    type: String,
    required: false,
    default: null,
  },
  id: {
    type: Number,
    required: false,
    default: null,
  },
  course: {
    type: Number,
    required: false,
    default: null,
  },
  existingMark: {
    type: Object,
    required: false,
    default: null,
  },
});

defineEmits([...useDialogPluginComponent.emits]);

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const cancelClicked = onDialogCancel;

const saveClicked = async () => {
  try {
    await submitMark();
    onDialogOK();
  } catch {}
};

const deleteClicked = async () => {
  try {
    await deleteMark();
    onDialogOK();
  } catch {}
};

const typeRef = ref(null);
const gradeRef = ref(null);

const mark = reactive({});

const markTypes = [
  {
    label: t("learning.marks.grade"),
    value: "grade",
  },
  {
    label: t("learning.marks.notDone"),
    value: "not_done",
  },
  {
    label: t("learning.marks.noticeGood"),
    value: "notice_good",
  },
  {
    label: t("learning.marks.noticeNeutral"),
    value: "notice_neutral",
  },
  {
    label: t("learning.marks.noticeBad"),
    value: "notice_bad",
  },
  {
    label: t("learning.marks.absent"),
    value: "absent",
  },
  {
    label: t("learning.marks.late"),
    value: "late",
  },
];

const grades = ref(null);
const getGrades = async () => {
  try {
    const response = await api.get("/grades");
    grades.value = response.data.grades !== null ? response.data.grades : [];
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

const gradeFilter = async (val, update) => {
  if (grades.value !== null) {
    update();
    return;
  }
  await getGrades();
  update();
};

const saveLoading = ref(false);
const submitMark = async () => {
  if (!typeRef.value.validate()) {
    throw new Error();
  } else if (mark.type.value === "grade" && !gradeRef.value.validate()) {
    throw new Error();
  }

  saveLoading.value = true;

  let data = new Object();

  if (!isUpdateDialog.value) {
    data.user_id = props.student.id;

    switch (props.type) {
      case "lesson":
        data.lesson_id = props.id;
        break;
      case "course":
        data.journal_id = props.id;
        data.course = props.course;
        break;
      case "subject":
        data.journal_id = props.id;
        break;
    }

    data.type = mark.type.value;

    if (props.type === "lesson" && mark.type.value === "grade") {
      data.type = "lesson_grade";
    } else if (props.type === "course") {
      data.type = "course_grade";
    } else if (props.type === "subject") {
      data.type = "subject_grade";
    }
  }

  if (mark.type.value === "grade") {
    data.grade_id = mark.grade.id;
  }

  if (mark.comment && mark.comment.trim() !== "") {
    data.comment = mark.comment;
  }

  try {
    if (!isUpdateDialog.value) {
      await api.post("/marks", data);
    } else {
      await api.patch("/marks/" + props.existingMark.id, data);
    }
    $q.notify({
      type: "positive",
      position: "top",
      message: t("learning.marks.savingMarkSucceeded"),
      timeout: 3000,
    });
    saveLoading.value = false;
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("learning.marks.savingMarkFailed"),
      timeout: 6000,
    });
    saveLoading.value = false;
    throw new Error();
  }
};

// editing a mark

const isUpdateDialog = computed(() => (props.existingMark ? true : false));

const deleteLoading = ref(false);
const deleteMark = async () => {
  deleteLoading.value = true;
  try {
    await api.delete("/marks/" + props.existingMark.id);
    $q.notify({
      type: "positive",
      position: "top",
      message: t("learning.marks.deletingMarkSucceeded"),
      timeout: 3000,
    });
    deleteLoading.value = false;
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("learning.marks.deletingMarkFailed"),
      timeout: 5000,
      actions: [{ label: t("dismiss"), color: "white" }],
    });
    deleteLoading.value = false;
    throw new Error();
  }
};

const deleteMarkPrompt = () => {
  $q.dialog({
    title: t("confirm"),
    message: t("learning.marks.deletingMarkConfirm"),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteClicked();
  });
};

const initialData = () => {
  mark.type = markTypes.find((t) => {
    if (
      t.value === "grade" &&
      (props.existingMark.type === "lesson_grade" ||
        props.existingMark.type === "course_grade" ||
        props.existingMark.type === "subject_grade")
    )
      return true;
    else if (t.value == props.existingMark.type) {
      return true;
    } else {
      return false;
    }
  });
  if (props.existingMark.grade && props.existingMark.grade.identifier) {
    mark.grade = props.existingMark.grade;
  }
  if (props.existingMark.comment) {
    mark.comment = props.existingMark.comment;
  }
};

if (isUpdateDialog.value) {
  initialData();
}

if (props.type === "course" || props.type === "subject") {
  mark.type = {
    label: "Grade",
    value: "grade",
  };
}
</script>
