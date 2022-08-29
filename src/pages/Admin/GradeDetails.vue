<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-6 col-xs-10">
        <q-card>
          <q-card-section>
            <div v-if="isCreate" class="text-h4">
              {{ t("learning.grades.createGrade") }}
            </div>
            <div v-else class="text-h4">
              {{ t("learning.grades.editGrade") }}
            </div>
          </q-card-section>
          <q-card-section>
            <q-form
              greedy
              class="q-col-gutter-sm"
              autocorrect="off"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false"
              @submit.prevent="submitGrade"
            >
              <q-input
                v-model.trim="identifier"
                filled
                :label="t('learning.grades.identifier')"
                :rules="[
                  (val) => (val && val.length > 0) || t('mandatoryField'),
                  (val) => val.length < 4 || t('mustBeLessThanNCharsLong', [4]),
                ]"
              ></q-input>
              <q-input
                v-model.number="value"
                filled
                :label="t('learning.grades.value')"
                :rules="[
                  (val) => (val && val > 0) || t('mustBeGreaterThanN', [0]),
                ]"
              ></q-input>
              <div class="row justify-end q-mt-sm">
                <q-btn
                  :loading="submitLoading"
                  type="submit"
                  color="primary"
                  :label="t('save')"
                ></q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref, computed, reactive, watch } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const router = useRouter();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  isCreate: {
    type: Boolean,
    required: false,
    default: false,
  },
});

// existing grade
const loading = ref(false);
const grade = reactive({ content: {} });
const getGrade = async () => {
  loading.value = true;
  try {
    const response = await api.get("/grades/" + props.id);
    grade.content = response.data.grade;
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

const identifier = ref("");
const value = ref(null);
const resetData = () => {
  identifier.value = grade.content.identifier;
  value.value = grade.content.value;
};

watch(grade, resetData);

if (!props.isCreate) {
  getGrade();
}

// create/update class request
const submitLoading = ref(false);
const submitGrade = async () => {
  submitLoading.value = true;
  try {
    if (!props.isCreate) {
      await api.patch("/grades/" + props.id, {
        identifier: identifier.value,
        value: value.value,
      });
    } else {
      await api.post("/grades", {
        identifier: identifier.value,
        value: value.value,
      });
    }
    $q.notify({
      type: "positive",
      position: "top",
      message: t("savingSucceeded"),
      timeout: 3000,
    });
    submitLoading.value = false;
    if (props.isCreate) {
      router.replace("/admin/grades");
    } else {
      getGrade();
    }
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
    submitLoading.value = false;
  }
};
</script>
