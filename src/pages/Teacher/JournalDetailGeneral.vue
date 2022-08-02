<template>
  <div
    class="row flex-center q-py-lg"
    :style="{ 'min-height': isCreate ? '90vh' : '75vh' }"
  >
    <div class="col-md-6 col-sm-10">
      <q-card>
        <q-card-section>
          <div class="text-h4" v-if="isCreate">Create Journal</div>
          <div class="text-h4" v-else>Update Journal</div>
        </q-card-section>
        <q-card-section>
          <q-form @submit.prevent="submitJournal" ref="form">
            <q-input
              filled
              label="Name"
              v-model.trim="journal.content.name"
              autocorrect="off"
              autocapitalize="off"
              autocomplete="off"
              spellcheck="false"
              :rules="[(val) => (val && val.length > 0) || 'Must not be empty']"
            ></q-input>
            <q-select
              filled
              label="Subject"
              v-model="journal.content.subject"
              :options="subjects"
              :disable="!isCreate"
              :rules="[(val) => val || 'Must be chosen']"
              option-value="id"
              option-label="name"
            ></q-select>
            <q-select
              v-if="!isCreate && userRole === 'admin'"
              filled
              label="Teacher"
              v-model="journal.content.teacher"
              use-input
              hide-selected
              fill-input
              input-debounce
              hint="Minimum 4 characters"
              @filter="teachersFilter"
              :options="teachers"
              option-label="name"
              option-value="id"
              :rules="[(val) => val || 'Must be chosen']"
            ></q-select>
            <div class="row justify-end q-mt-sm">
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

<script>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { reactive, ref, watch } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "JournalNew",
  props: ["isCreate", "serverJournal"],
  emits: ["refreshJournal"],
  setup(props, context) {
    const $q = useQuasar();
    const router = useRouter();

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
          context.emit("refreshJournal");
        }
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message:
            (props.isCreate ? "Creating" : "Updating") + " journal failed!",
          timeout: 6000,
        });
        submitLoading.value = false;
      }
    };

    // teachers
    const teachers = ref(null);
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

    if (props.isCreate) {
      getSubjects();
    }

    return {
      journal,
      submitLoading,
      subjects,
      subjectsLoading,
      userRole,
      teachers,
      teachersFilter,
      submitJournal,
    };
  },
};
</script>
