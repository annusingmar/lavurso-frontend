<template>
  <q-card>
    <q-card-section>
      <div class="text-h4">Students</div>
    </q-card-section>
    <q-card-section>
      <q-list bordered separator v-if="students.length > 0">
        <q-item v-for="student in students" :key="student.id">
          <q-item-section>{{ student.name }}</q-item-section>
          <q-item-section side v-if="!archived">
            <q-btn
              @click="removeStudent(student.id)"
              flat
              round
              icon="highlight_off"
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
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";

const $q = useQuasar();
const props = defineProps(["students", "id", "archived"]);
const emit = defineEmits(["refreshStudents"]);

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
