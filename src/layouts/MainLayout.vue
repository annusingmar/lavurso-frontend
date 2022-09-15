<template>
  <q-layout view="lHh Lpr lFf">
    <TheHeader @toggle-left-drawer="toggleLeftDrawer"></TheHeader>
    <template v-if="id">
      <TheSidebar
        :open="leftDrawerOpen"
        @set-left-drawer="setLeftDrawer"
      ></TheSidebar>
      <q-page-container>
        <router-view />
      </q-page-container>
    </template>
  </q-layout>
</template>

<script setup>
import { ref } from "vue";
import TheHeader from "src/components/TheHeader.vue";
import TheSidebar from "src/components/TheSidebar.vue";

import { useUserStore } from "src/stores/user";
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import { api } from "src/boot/axios";
import { useRouter } from "vue-router";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const { setUser } = useUserStore();
const { id, role, children } = storeToRefs(useUserStore());
const router = useRouter();

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const setLeftDrawer = (val) => {
  leftDrawerOpen.value = val;
};

const getUserData = async () => {
  try {
    const response = await api.get("/me");
    setUser(response.data);
    if (router.currentRoute.value.path === "/") {
      switch (role.value) {
        case "admin":
        case "teacher":
          router.replace("/teacher/journals");
          break;
        case "student":
          router.replace("/students/" + id.value);
          break;
        case "parent":
          if (children.value && children.value.length > 0) {
            router.replace("/students/" + children.value[0].id);
          }
          break;
      }
    }
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("dataLoadingFail"),
      timeout: 0,
      actions: [{ label: t("dismiss"), color: "white" }],
    });
  }
};

getUserData();
</script>
