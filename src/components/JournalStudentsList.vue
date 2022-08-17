<template>
  <q-card>
    <q-card-section>
      <div class="text-h4">Students</div>
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
              <q-tooltip>Remove student from journal</q-tooltip>
            </q-btn>
          </q-item-section>
        </q-item>
      </q-list>
      <div v-else>No students in journal</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";

const $q = useQuasar();
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

const { role } = storeToRefs(useUserStore());

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
      message: "Student removed successfully",
      timeout: 3000,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Removing student failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  } finally {
    emit("refreshStudents");
  }
};
</script>
