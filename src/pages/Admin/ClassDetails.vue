<template>
  <q-page>
    <div
      class="row justify-center items-start q-py-lg q-col-gutter-md"
      style="min-height: inherit; align-content: center"
    >
      <template v-if="!isCreate">
        <div class="col-md-4 col-xs-10">
          <ClassDetailInfo :id="Number(id)"></ClassDetailInfo>
        </div>
        <div class="col-md-4 col-xs-10">
          <ClassDetailYears :id="Number(id)"></ClassDetailYears>
        </div>
      </template>
      <div v-else class="col-md-8 col-xs-10">
        <ClassDetailInfo :is-create="isCreate"></ClassDetailInfo>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import ClassDetailInfo from "src/components/ClassDetailInfo.vue";
import ClassDetailYears from "src/components/ClassDetailYears.vue";

defineProps({
  id: {
    type: String,
    required: false,
    default: "0",
  },
  isCreate: {
    type: Boolean,
    required: false,
    default: false,
  },
});
</script>
