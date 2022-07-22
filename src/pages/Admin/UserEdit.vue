<template>
  <q-page>
    <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
      <q-tab name="general" label="General"></q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated>
      <q-tab-panel name="general">
        <UserEditGeneral :id="id"></UserEditGeneral>
      </q-tab-panel>
    </q-tab-panels>
  </q-page>
</template>

<script>
import { ref } from "vue";

import UserEditGeneral from "./UserEditGeneral.vue";

export default {
  props: ["id"],
  components: { UserEditGeneral },
  setup() {
    const tab = ref("general");
    return { tab };
  },
};
</script>
