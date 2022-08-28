<template>
  <q-card>
    <q-card-section>
      <div class="text-h4">{{ t("learning.students") }}</div>
    </q-card-section>
    <q-card-section>
      <q-list v-if="students.length > 0" bordered separator>
        <q-item v-for="student in students" :key="student.id">
          <q-item-section>{{ student.name }}</q-item-section>
          <q-item-section v-if="!archived && role === 'admin'" side>
            <q-btn
              flat
              round
              icon="highlight_off"
              @click="removeStudent(student.id)"
            >
              <q-tooltip>{{
                t("learning.journals.removeStudentFromJournal")
              }}</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else>{{ t("learning.noStudentsInJournal") }}</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  students: {
    type: Array,
    required: true,
  },
  id: {
    type: Number,
    required: true,
  },
  archived: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["refreshStudents"]);

const { role } = useUserStore();

const removeStudent = async (id) => {
  try {
    await api.delete("/journals/" + props.id + "/students", {
      data: {
        student_id: id,
      },
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: t("learning.journals.removingStudentSucceeded"),
      timeout: 3000,
    });
    emit("refreshStudents");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("learning.journals.removingStudentFailed"),
      timeout: 6000,
    });
  }
};
</script>
