<template>
  <q-tab-panels
    v-model="tab"
    animated
    keep-alive
    class="row"
    style="min-height: 89vh; align-items: center"
  >
    <q-tab-panel name="latest">
      <StudentLatest :id="Number(id)" :key="$route.fullPath"></StudentLatest>
    </q-tab-panel>
    <q-tab-panel name="assignments">
      <StudentAssignmentList
        :id="Number(id)"
        :key="$route.fullPath"
      ></StudentAssignmentList>
    </q-tab-panel>
  </q-tab-panels>

  <q-separator></q-separator>

  <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
    <q-tab name="latest" :label="t('learning.latest')"></q-tab>
    <q-tab name="assignments" :label="t('learning.assignments')"></q-tab>
  </q-tabs>
</template>

<script setup>
import { ref } from "vue";
import { useI18n } from "vue-i18n";
import StudentLatest from "src/components/StudentLatest.vue";
import StudentAssignmentList from "src/components/StudentAssignmentList.vue";

const tab = ref("latest");
const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
</script>
