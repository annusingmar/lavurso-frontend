<template>
  <q-page>
    <div
      class="row flex-center q-py-lg q-col-gutter-md"
      style="min-height: inherit"
    >
      <div class="col-md-5 col-xs-10">
        <div>x</div>
      </div>
      <div class="col-md-5 col-xs-10">
        <StudentAssignmentListCard></StudentAssignmentListCard>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import StudentAssignmentListCard from "src/components/StudentAssignmentListCard.vue";
</script>
