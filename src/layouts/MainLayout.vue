<template>
  <q-layout view="lHh Lpr lFf">
    <TheHeader @toggle-left-drawer="toggleLeftDrawer"></TheHeader>
    <TheSidebar :open="leftDrawerOpen"></TheSidebar>
    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import { ref } from "vue";

import TheHeader from "src/components/TheHeader.vue";
import TheSidebar from "src/components/TheSidebar.vue";

export default {
  components: {
    TheHeader,
    TheSidebar,
  },
  setup() {
    const leftDrawerOpen = ref(false);

    const toggleLeftDrawer = () => {
      leftDrawerOpen.value = !leftDrawerOpen.value;
    };

    return { leftDrawerOpen, toggleLeftDrawer };
  },
};
</script>
