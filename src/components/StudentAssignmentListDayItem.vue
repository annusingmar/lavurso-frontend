<template>
  <q-card>
    <q-card-section class="q-pb-none">
      <div class="text-h6">{{ day }}</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-list v-if="assignments.length > 0">
        <StudentAssignmentItem
          v-for="a in assignments"
          :id="id"
          :key="a.id"
          :assignment="a"
        />
      </q-list>
      <div v-else class="text-italic">No assignments</div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { date } from "quasar";
import { computed } from "vue";
import StudentAssignmentItem from "./StudentAssignmentItem.vue";

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
  date.formatDate(new Date(props.date), "dddd, DD. MMMM")
);
</script>
