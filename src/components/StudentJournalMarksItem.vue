<template>
  <q-card>
    <q-card-section>
      <div class="text-h5">{{ journal.subject.name }}</div>
    </q-card-section>
    <q-separator></q-separator>
    <q-card-section v-if="journal.marks" class="q-gutter-y-md">
      <StudentCourseItem
        v-for="(marks, course) in journal.marks"
        :key="course"
        :course="Number(course)"
        :marks="marks"
        :student-id="studentId"
        :journal-id="journal.id"
        @refresh-above="emit('refreshAbove')"
      ></StudentCourseItem>
    </q-card-section>
    <q-card-section v-else>{{ t("learning.noCoursesFound") }}</q-card-section>
  </q-card>
</template>

<script setup>
import { useI18n } from "vue-i18n";
import StudentCourseItem from "./StudentCourseItem.vue";

const { t } = useI18n({ useScope: "global" });
defineProps({
  studentId: {
    type: Number,
    required: true,
  },
  journal: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["refreshAbove"]);
</script>
