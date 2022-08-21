<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div v-if="!isUpdateDialog" class="text-h5">Add Mark</div>
        <div v-else class="row justify-between items-center">
          <div class="text-h5">Update Mark</div>
          <q-btn
            color="negative"
            label="delete"
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
            label="Mark Type"
            :rules="[(val) => val || 'Must be chosen']"
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
            label="Grade"
            option-value="id"
            option-label="identifier"
            :rules="[(val) => val || 'Must be chosen']"
            @filter="gradeFilter"
          ></q-select>
          <q-input
            v-model="mark.comment"
            filled
            autogrow
            label="Comment (optional)"
          ></q-input>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          color="primary"
          label="Save"
          :loading="saveLoading"
          @click="saveClicked"
        ></q-btn>
        <q-btn label="cancel" @click="cancelClicked"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { computed, reactive, ref } from "vue";

const $q = useQuasar();
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
    label: "Grade",
    value: "grade",
  },
  {
    label: "Not done",
    value: "not_done",
  },
  {
    label: "Notice (Good)",
    value: "notice_good",
  },
  {
    label: "Notice (Neutral)",
    value: "notice_neutral",
  },
  {
    label: "Notice (Bad)",
    value: "notice_bad",
  },
  {
    label: "Absent",
    value: "absent",
  },
  {
    label: "Late",
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
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
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
      message: "Saving mark succeeded",
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
      message: "Saving mark failed",
      timeout: 5000,
      actions: [{ label: "Dismiss", color: "white" }],
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
      message: "Deleting mark succeeded",
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
      message: "Deleting mark failed",
      timeout: 5000,
      actions: [{ label: "Dismiss", color: "white" }],
    });
    deleteLoading.value = false;
    throw new Error();
  }
};

const deleteMarkPrompt = () => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this mark?",
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
