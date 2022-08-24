<template>
  <q-page>
    <div
      class="row flex-center q-py-lg q-col-gutter-md"
      style="min-height: inherit"
    >
      <div class="col-md-5 col-xs-10">
        <StudentLatest></StudentLatest>
      </div>
      <div class="col-md-5 col-xs-10">
        <StudentAssignmentList></StudentAssignmentList>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import StudentAssignmentList from "src/components/StudentAssignmentList.vue";
import StudentLatest from "../../components/StudentLatest.vue";
</script>
