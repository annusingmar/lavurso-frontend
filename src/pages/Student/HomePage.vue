<template>
  <q-page>
    <div
      class="row justify-center items-start q-py-lg q-col-gutter-md"
      style="min-height: inherit; align-content: center"
    >
      <div class="col-md-5 col-xs-10">
        <StudentLatest :id="Number(id)" :key="$route.fullPath"></StudentLatest>
      </div>
      <div class="col-md-5 col-xs-10">
        <StudentAssignmentList
          :id="Number(id)"
          :key="$route.fullPath"
        ></StudentAssignmentList>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import StudentAssignmentList from "src/components/StudentAssignmentList.vue";
import StudentLatest from "../../components/StudentLatest.vue";

defineProps({
  id: {
    type: String,
    required: true,
  },
});
</script>
