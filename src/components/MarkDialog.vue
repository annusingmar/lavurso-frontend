<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div class="text-h5">Add Mark</div>
      </q-card-section>
      <q-card-section>
        <div class="q-gutter-y-xs">
          <q-select
            ref="typeRef"
            filled
            :options="markTypes"
            label="Mark Type"
            v-model="mark.type"
            :rules="[(val) => val || 'Must be chosen']"
          ></q-select>
          <q-select
            v-if="mark.type && mark.type.value === 'grade'"
            ref="gradeRef"
            filled
            :options="grades"
            label="Grade"
            v-model="mark.grade"
            option-value="id"
            option-label="identifier"
            @filter="gradeFilter"
            :rules="[(val) => val || 'Must be chosen']"
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
        <q-btn color="primary" label="Save" @click="saveClicked"></q-btn>
        <q-btn label="cancel" @click="cancelClicked"></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script setup>
import { useDialogPluginComponent, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";

const $q = useQuasar();
const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  lesson: {
    type: Object,
    required: false,
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

const typeRef = ref(null);
const gradeRef = ref(null);

const mark = ref({});
const markTypes = [
  {
    label: "Grade",
    value: "grade",
  },
  {
    label: "Homework not done",
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
  } else if (mark.value.type.value === "grade" && !gradeRef.value.validate()) {
    throw new Error();
  }

  saveLoading.value = true;

  let data = {
    user_id: props.student.id,
  };

  if (props.type === "lesson") {
    data.lesson_id = props.lesson.id;
  }

  if (mark.value.type.value === "grade") {
    data.grade_id = mark.value.grade.id;
  }

  if (mark.value.comment && mark.value.comment.trim() !== "") {
    data.comment = mark.value.comment;
  }

  data.type = mark.value.type.value;

  if (props.type === "lesson" && mark.value.type.value === "grade") {
    data.type = "lesson_grade";
  }

  try {
    await api.post("/marks", data);
    saveLoading.value = false;
    $q.notify({
      type: "positive",
      position: "top",
      message: "Saving mark succeeded",
      timeout: 3000,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Saving mark failed",
      timeout: 5000,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};
</script>
