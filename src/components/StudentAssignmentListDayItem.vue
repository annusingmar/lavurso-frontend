<template>
  <q-card flat>
    <q-card-section class="q-py-none">
      <div class="text-h6">{{ day }}</div>
    </q-card-section>
    <q-card-section class="q-py-none">
      <q-list>
        <StudentAssignmentItem
          v-for="a in assignments"
          :id="id"
          :key="a.id"
          :assignment="a"
        />
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { computed } from "vue";
import StudentAssignmentItem from "./StudentAssignmentItem.vue";

const $q = useQuasar();

const props = defineProps({
  assignments: {
    type: Array,
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  id: {
    type: Number,
    required: false,
    default: null,
  },
});

const day = computed(() =>
  date.formatDate(new Date(props.date), "dddd, DD. MMMM", $q.lang.date)
);
</script>
