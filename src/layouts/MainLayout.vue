<template>
  <q-layout view="lHh Lpr lFf">
    <TheHeader @toggle-left-drawer="toggleLeftDrawer"></TheHeader>
    <TheSidebar
      :open="leftDrawerOpen"
      @set-left-drawer="setLeftDrawer"
    ></TheSidebar>
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

    const setLeftDrawer = (val) => {
      leftDrawerOpen.value = val;
    };

    return { leftDrawerOpen, toggleLeftDrawer, setLeftDrawer };
  },
};
</script>
