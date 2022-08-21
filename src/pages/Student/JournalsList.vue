<template>
  <q-page>
    <StudentJournals
      :id="id"
      :name="name"
      class="q-py-lg"
      style="min-height: inherit"
    ></StudentJournals>
  </q-page>
</template>

<script setup>
import StudentJournals from "src/components/StudentJournals.vue";
import { useUserStore } from "src/stores/user";

const { id, name } = useUserStore();
</script>
