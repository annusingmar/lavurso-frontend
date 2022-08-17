<template>
  <div
    class="row flex-center q-py-lg"
    :style="{ 'min-height': isCreate ? 'inherit' : '75vh' }"
  >
    <div class="col-md-6 col-xs-10">
      <q-card>
        <q-card-section>
          <div class="row q-gutter-x-md">
            <div>
              <div v-if="isCreate" class="text-h4">Create Journal</div>
              <div v-else class="text-h4">Update Journal</div>
            </div>
            <q-btn
              v-if="!isCreate && !isArchived"
              color="warning"
              label="archive"
              :loading="archiveLoading"
              @click="archiveJournalPrompt"
            ></q-btn>
            <div v-else-if="!isCreate && userRole === 'admin'" class="row">
              <q-btn
                color="secondary"
                label="unarchive"
                :loading="unarchiveLoading"
                @click="unarchiveJournal"
              ></q-btn>
              <q-btn
                color="negative"
                label="delete"
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
            class="q-col-gutter-y-sm"
            @submit.prevent="submitJournal"
          >
            <q-input
              v-model.trim="journal.content.name"
              filled
              label="Name"
              autocorrect="off"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false"
              :rules="[(val) => (val && val.length > 0) || 'Must not be empty']"
              :disable="isArchived"
            ></q-input>
            <q-select
              v-model="journal.content.subject"
              filled
              label="Subject"
              :options="subjects"
              :disable="!isCreate"
              :rules="[(val) => val || 'Must be chosen']"
              option-value="id"
              option-label="name"
            ></q-select>
            <q-select
              v-if="!isCreate && userRole === 'admin'"
              v-model="journal.content.teacher"
              filled
              label="Teacher"
              use-input
              hide-selected
              fill-input
              input-debounce
              hint="Minimum 4 characters"
              :options="teachers"
              option-label="name"
              option-value="id"
              :rules="[(val) => val || 'Must be chosen']"
              :disable="isArchived"
              @filter="teachersFilter"
            ></q-select>
            <div v-if="!isArchived" class="row justify-end q-mt-sm">
              <q-btn
                :loading="submitLoading"
                type="submit"
                color="primary"
                :label="isCreate ? 'Create' : 'Update'"
              ></q-btn>
            </div>
          </q-form>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { computed, reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

const $q = useQuasar();
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

const userStoreRef = storeToRefs(useUserStore());
const userRole = userStoreRef.role;

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
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};

const isArchived = computed(
  () => props.serverJournal && props.serverJournal.content.archived
);

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
  if (!props.isCreate && userRole.value === "admin") {
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
      message:
        (props.isCreate ? "Creating" : "Updating") + " journal succeeded!",
      timeout: 3000,
    });
    submitLoading.value = false;
    if (props.isCreate) {
      router.replace("/teacher/journals");
    } else {
      emit("refreshJournal");
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: (props.isCreate ? "Creating" : "Updating") + " journal failed!",
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
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
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

// archive journal

const archiveLoading = ref(false);
const archiveJournal = async () => {
  archiveLoading.value = true;
  try {
    await api.put("/journals/" + props.serverJournal.content.id + "/archive");
    $q.notify({
      type: "positive",
      position: "top",
      message: "Archiving journal succeeded",
      timeout: 3000,
    });
    archiveLoading.value = false;
    router.replace("/teacher/journals");
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Archiving journal failed",
      timeout: 6000,
    });
    archiveLoading.value = false;
  }
};

const archiveJournalPrompt = () => {
  $q.dialog({
    title: "Confirm",
    message:
      "Are you sure you want to archive this journal? This action can only be reversed by an administrator.",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    archiveJournal();
  });
};

const unarchiveLoading = ref(false);
const unarchiveJournal = async () => {
  unarchiveLoading.value = true;
  try {
    await api.put("/journals/" + props.serverJournal.content.id + "/unarchive");
    $q.notify({
      type: "positive",
      position: "top",
      message: "Unarchiving journal succeeded",
      timeout: 3000,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Unarchiving journal failed",
      timeout: 6000,
    });
  } finally {
    unarchiveLoading.value = false;
    emit("refreshJournal");
  }
};

const deleteLoading = ref(false);
const deleteJournal = async () => {
  deleteLoading.value = true;
  try {
    await api.delete("/journals/" + props.serverJournal.content.id);
    $q.notify({
      type: "positive",
      position: "top",
      message: "Deleting journal succeeded",
      timeout: 3000,
    });
    deleteLoading.value = false;
    router.replace("/teacher/journals");
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Deleting journal failed",
      timeout: 6000,
    });
    deleteLoading.value = false;
  }
};

const deleteJournalPrompt = () => {
  $q.dialog({
    title: "Confirm",
    message:
      "Are you sure you want to delete this journal? This action will remove all lessons, assignments and marks associated with this journal, and CANNOT be undone.",
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
