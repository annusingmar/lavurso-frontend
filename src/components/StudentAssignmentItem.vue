<template>
  <q-item :class="{ done: done }">
    <q-item-section v-if="id" avatar top>
      <q-checkbox
        :model-value="done"
        @update:model-value="setDone"
      ></q-checkbox>
    </q-item-section>
    <q-item-section>
      <div class="row q-gutter-x-sm">
        <q-badge
          v-if="assignment.type === 'test'"
          color="orange"
          label="TEST"
        ></q-badge>
        <q-badge v-else color="blue" label="HOMEWORK"></q-badge>
        <div class="text-weight-bold">{{ assignment.subject.name }}</div>
      </div>
      <q-item-label class="q-mt-sm" style="white-space: pre">{{
        assignment.description
      }}</q-item-label>
    </q-item-section>
    <q-item-section side top>
      <q-icon name="schedule" size="xs">
        <q-tooltip>
          <div>Added at {{ createdAt }}</div>
          <div v-if="updatedAt">Edited at {{ updatedAt }}</div>
        </q-tooltip>
      </q-icon>
    </q-item-section>
  </q-item>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { computed, ref } from "vue";

const $q = useQuasar();
const props = defineProps({
  assignment: {
    type: Object,
    required: true,
  },
  id: {
    type: Number,
    required: false,
    default: null,
  },
});

const done = ref(props.assignment.done);
const setDone = async (val) => {
  try {
    if (done.value) {
      await api.put(
        "/students/" +
          props.id +
          "/assignments/" +
          props.assignment.id +
          "/done"
      );
    } else {
      await api.delete(
        "/students/" +
          props.id +
          "/assignments/" +
          props.assignment.id +
          "/done"
      );
    }
    done.value = val;
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Setting assignment done status failed",
      timeout: 6000,
    });
  }
};

const createdAt = computed(() =>
  date.formatDate(
    props.assignment.created_at,
    "DD. MMM YYYY HH:mm",
    $q.lang.date
  )
);

const updatedAt = computed(() =>
  date.getDateDiff(
    new Date(props.assignment.updated_at),
    new Date(props.assignment.created_at),
    "seconds"
  )
    ? date.formatDate(
        props.assignment.updated_at,
        "DD. MMM YYYY HH:mm",
        $q.lang.date
      )
    : null
);
</script>

<style scoped>
.done {
  opacity: 0.4;
}
</style>
