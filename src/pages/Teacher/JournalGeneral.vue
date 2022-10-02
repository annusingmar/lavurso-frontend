<template>
  <div
    class="row flex-center q-py-lg"
    :style="{ 'min-height': isCreate ? '90vh' : '75vh' }"
  >
    <div class="col-md-6 col-xs-10">
      <q-card>
        <q-card-section>
          <div class="row justify-between items-center">
            <div>
              <div v-if="isCreate" class="text-h4">
                {{ t("learning.journals.createJournal") }}
              </div>
              <div v-else class="text-h4">
                {{ t("learning.journals.editJournal") }}
              </div>
            </div>
            <div v-if="!isCreate && role === 'admin'" class="row">
              <q-btn
                color="negative"
                :label="t('delete')"
                class="q-ml-sm"
                :loading="deleteLoading"
                @click="deleteJournalPrompt"
              ></q-btn>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-form
            ref="form"
            greedy
            class="q-col-gutter-y-sm"
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
            @submit.prevent="submitJournal"
          >
            <q-input
              v-model.trim="journal.content.name"
              filled
              :label="t('name')"
              :rules="[(val) => (val && val.length > 0) || t('mandatoryField')]"
            ></q-input>
            <q-select
              v-model="journal.content.subject"
              filled
              :label="t('learning.subject')"
              :options="subjects"
              :disable="!isCreate"
              :rules="[(val) => val || t('mandatoryField')]"
              option-value="id"
              option-label="name"
            ></q-select>
            <q-select
              v-if="!isCreate && role === 'admin'"
              v-model="journal.content.teacher"
              filled
              :label="t('learning.teacher')"
              use-input
              hide-selected
              fill-input
              input-debounce
              :hint="t('minimumNCharacters', [4])"
              :options="teachers"
              option-label="name"
              option-value="id"
              :rules="[(val) => val || t('mandatoryField')]"
              @filter="teachersFilter"
            ></q-select>
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
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const router = useRouter();
const props = defineProps({
  isCreate: {
    type: Boolean,
    required: true,
  },
  serverJournal: {
    type: Object,
    required: false,
    default: null,
  },
});
const emit = defineEmits(["refreshJournal"]);

const { role } = useUserStore();

const subjectsLoading = ref(true);
const subjects = ref([]);
const getSubjects = async () => {
  subjectsLoading.value = true;
  try {
    const response = await api.get("/subjects");
    subjects.value =
      response.data.subjects !== null ? response.data.subjects : [];
    subjectsLoading.value = false;
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

const journal = reactive({ content: {} });

// existing
const resetData = () => {
  journal.content.name = props.serverJournal.content.name;
  journal.content.subject = props.serverJournal.content.subject;
  journal.content.teacher = props.serverJournal.content.teacher;
};
if (!props.isCreate) {
  watch(props.serverJournal, resetData, { immediate: true });
}

const submitLoading = ref(false);
const submitJournal = async () => {
  submitLoading.value = true;
  let data = {
    name: journal.content.name,
  };
  if (props.isCreate) {
    data.subject_id = journal.content.subject.id;
  }
  if (!props.isCreate && role === "admin") {
    data.teacher_id = journal.content.teacher.id;
  }
  try {
    if (!props.isCreate) {
      await api.patch("/journals/" + props.serverJournal.content.id, data);
    } else {
      await api.post("/journals", data);
    }
    $q.notify({
      type: "positive",
      position: "top",
      message: t("learning.journals.savingJournalSucceeded"),
      timeout: 3000,
    });
    submitLoading.value = false;
    if (props.isCreate) {
      router.replace("/teacher/journals");
    } else {
      emit("refreshJournal");
    }
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("learning.journals.savingJournalFailed"),
      timeout: 6000,
    });
    submitLoading.value = false;
  }
};

// teachers
const teachers = ref([]);
const getTeachers = async (search) => {
  try {
    const response = await api.get("/users/search", {
      params: {
        name: search,
      },
    });
    teachers.value =
      response.data.result !== null
        ? response.data.result.filter(
            (u) => u.role === "teacher" || u.role === "admin"
          )
        : [];
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

const teachersFilter = async (val, update, abort) => {
  if (val.length < 4) {
    abort();
    return;
  }
  await getTeachers(val);
  update();
};

const deleteLoading = ref(false);
const deleteJournal = async () => {
  deleteLoading.value = true;
  try {
    await api.delete("/journals/" + props.serverJournal.content.id);
    $q.notify({
      type: "positive",
      position: "top",
      message: t("learning.journals.deletingJournalSucceeded"),
      timeout: 3000,
    });
    deleteLoading.value = false;
    router.replace("/teacher/journals");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("learning.journals.deletingJournalFailed"),
      timeout: 6000,
    });
    deleteLoading.value = false;
  }
};

const deleteJournalPrompt = () => {
  $q.dialog({
    title: t("confirm"),
    message: t("learning.journals.deletingJournalConfirm"),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteJournal();
  });
};

if (props.isCreate) {
  getSubjects();
}
</script>
