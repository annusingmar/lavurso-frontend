<template>
  <q-item v-ripple clickable>
    <q-item-section>
      <div class="row q-gutter-x-sm">
        <q-badge
          v-if="assignment.type === 'test'"
          color="orange"
          label="TEST"
        ></q-badge>
        <q-badge v-else color="blue" label="HOMEWORK"></q-badge>
        <q-item-label>
          {{ deadline }}
        </q-item-label>
      </div>
      <q-item-label :lines="1" class="q-mt-sm">{{
        assignment.description
      }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { computed } from "vue";
import { date } from "quasar";

const props = defineProps({
  assignment: {
    type: Object,
    required: true,
  },
});

const deadline = computed(() => {
  const deadlineDate = new Date(props.assignment.deadline);
  let formattedDate = date.formatDate(deadlineDate, "DD. MMMM YYYY");
  if (date.isSameDate(new Date(), deadlineDate, "date")) {
    formattedDate += " (today)";
  }
  return formattedDate;
});
</script>
