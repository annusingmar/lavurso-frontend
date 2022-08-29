<template>
  <q-drawer
    show-if-above
    :model-value="open"
    side="left"
    elevated
    @update:model-value="drawerStateChange"
  >
    <q-img src="~assets/beach.jpg" style="height: 200px">
      <div class="absolute-bottom row items-end">
        <div class="col">
          <div class="text-weight-bold">{{ name }}</div>
          <div>{{ t(`roles.${role}`) }}</div>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            text-color="white"
            :loading="logoutLoading"
            :label="t('sidebar.logOut')"
            @click="logOut"
          ></q-btn>
        </div>
      </div>
    </q-img>
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label>{{ t("sidebar.darkMode") }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle
            color="grey"
            :model-value="$q.dark.isActive"
            checked-icon="dark_mode"
            unchecked-icon="light_mode"
            @update:model-value="changeDarkMode"
          ></q-toggle>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>{{ t("sidebar.language") }}</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <LanguagePicker />
        </q-item-section>
      </q-item>
      <q-separator></q-separator>
      <DrawerUserItems :unread="unread" />
      <DrawerStudentItems v-if="role === 'student'" :id="id" />
      <template v-else-if="role === 'parent'">
        <DrawerStudentItems
          v-for="c in children"
          :id="c.id"
          :key="c.id"
          :name="c.name"
        ></DrawerStudentItems>
      </template>
      <DrawerTeacherItems
        v-if="role === 'admin' || role === 'teacher'"
        :role="role"
      />
      <DrawerAdminItems v-if="role === 'admin'" />
    </q-list>
  </q-drawer>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useUserStore } from "../stores/user.js";
import { ref } from "vue";
import { api } from "src/boot/axios.js";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import DrawerUserItems from "./DrawerUserItems.vue";
import DrawerStudentItems from "./DrawerStudentItems.vue";
import DrawerTeacherItems from "./DrawerTeacherItems.vue";
import DrawerAdminItems from "./DrawerAdminItems.vue";
import LanguagePicker from "./LanguagePicker.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const router = useRouter();

const { id, name, role, session_id, children, clearUser } = useUserStore();

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["setLeftDrawer"]);

const changeDarkMode = (val) => $q.dark.set(val);

const drawerStateChange = (val) => {
  emit("setLeftDrawer", val);
};

const logoutLoading = ref(false);
const logOut = async () => {
  logoutLoading.value = true;
  try {
    await api.delete("/sessions/" + session_id);
    clearInterval(unreadInterval);
    changeDarkMode(false);
    clearUser();
    router.replace("/login");
  } catch (error) {
    console.log("fail");
  } finally {
    logoutLoading.value = false;
  }
};

const checkUnread = () =>
  api
    .get("/users/" + id + "/unread")
    .then((response) => (unread.value = response.data.unread))
    .catch(() => console.log("failed to check if user has unread messages"));

const unread = ref(false);
checkUnread();
const unreadInterval = setInterval(checkUnread, 120000);
</script>
