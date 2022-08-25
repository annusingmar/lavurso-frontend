<template>
  <q-tab-panels
    v-model="tab"
    animated
    keep-alive
    class="row"
    style="min-height: 89vh; align-items: center"
  >
    <q-tab-panel name="latest">
      <StudentLatest></StudentLatest>
    </q-tab-panel>
    <q-tab-panel name="assignments">
      <StudentAssignmentList></StudentAssignmentList>
    </q-tab-panel>
  </q-tab-panels>

  <q-separator></q-separator>

  <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
    <q-tab name="latest" label="Latest"></q-tab>
    <q-tab name="assignments" label="Assignments"></q-tab>
  </q-tabs>
</template>

<script setup>
import { ref } from "vue";
import StudentLatest from "src/components/StudentLatest.vue";
import StudentAssignmentList from "src/components/StudentAssignmentList.vue";

const tab = ref("latest");
</script>
