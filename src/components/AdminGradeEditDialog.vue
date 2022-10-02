<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="q-dialog-plugin">
      <q-card-section>
        <div v-if="!isUpdateDialog" class="text-h4">
          {{ t("learning.grades.createGrade") }}
        </div>
        <div v-else class="text-h4">
          {{ t("learning.grades.editGrade") }}
        </div>
      </q-card-section>
      <q-card-section class="q-gutter-y-sm">
        <q-input
          v-model.trim="grade.identifier"
          filled
          :label="t('learning.grades.identifier')"
          :hint="t('mustBeLessThanNCharsLong', [4])"
        ></q-input>
        <q-input
          v-model.number="grade.value"
          filled
          :label="t('learning.grades.value')"
        ></q-input>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn
          :loading="saveLoading"
          :disable="saveButtonDisabled"
          color="primary"
          :label="t('save')"
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
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

defineEmits([...useDialogPluginComponent.emits]);

const props = defineProps({
  existingGrade: {
    type: Object,
    required: false,
    default: null,
  },
});

const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } =
  useDialogPluginComponent();

const cancelClicked = onDialogCancel;
const saveClicked = async () => {
  try {
    await saveGrade();
    onDialogOK();
  } catch (err) {
    console.log(err);
  }
};

const saveGrade = async () => {
  saveLoading.value = true;
  try {
    if (isUpdateDialog.value) {
      await api.patch("/grades/" + props.existingGrade.id, {
        identifier: grade.value.identifier,
        value: grade.value.value,
      });
    } else {
      await api.post("/grades", {
        identifier: grade.value.identifier,
        value: grade.value.value,
      });
    }
    $q.notify({
      type: "positive",
      position: "top",
      message: t("savingSucceeded"),
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
      message: t("savingFailed"),
      timeout: 6000,
    });
    saveLoading.value = false;
  }
};

const isUpdateDialog = computed(() => (props.existingGrade ? true : false));

const saveButtonDisabled = computed(
  () =>
    !(
      grade.value.identifier &&
      grade.value.identifier.length < 4 &&
      grade.value.value &&
      grade.value.value > 0
    )
);

const saveLoading = ref(false);
const grade = ref({});

const initialData = () => {
  grade.value.identifier = props.existingGrade.identifier;
  grade.value.value = props.existingGrade.value;
};

if (isUpdateDialog.value) {
  initialData();
}
</script>
