<template>
  <q-page>
    <div
      class="row flex-center q-py-lg q-col-gutter-md"
      style="min-height: inherit"
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
import { useRoute } from "vue-router";
import StudentLatest from "../../components/StudentLatest.vue";

const route = useRoute();

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
</script>
