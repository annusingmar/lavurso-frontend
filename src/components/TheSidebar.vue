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
          <div>{{ roleName }}</div>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            text-color="white"
            :loading="logoutLoading"
            @click="logOut"
            >Log out</q-btn
          >
        </div>
      </div>
    </q-img>
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label>Dark mode</q-item-label>
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
          <q-item-label>Language</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-select
            v-model="lang"
            :options="availableLanguages"
            dense
            borderless
            options-dense
            map-options
          ></q-select>
        </q-item-section>
      </q-item>
      <q-separator></q-separator>
      <DrawerListItem
        v-for="(item, index) in menuItems"
        :key="index"
        :title="item.title"
        :icon="item.icon"
        :to="item.to"
        :separator="item.separator"
      ></DrawerListItem>
      <template v-if="role === 'student'">
        <DrawerListItem
          v-for="(item, index) in studentMenuItems"
          :key="index"
          :title="item.title"
          :icon="item.icon"
          :to="item.to"
          :separator="item.separator"
        ></DrawerListItem
      ></template>
      <template v-if="role === 'admin' || role === 'teacher'">
        <DrawerListItem
          v-for="(item, index) in teacherMenuItems"
          :key="index"
          :title="item.title"
          :icon="item.icon"
          :to="item.to"
          :separator="item.separator"
        ></DrawerListItem>
      </template>
      <template v-if="role === 'admin'">
        <DrawerListItem
          v-for="(item, index) in adminMenuItems"
          :key="index"
          :title="item.title"
          :icon="item.icon"
          :to="item.to"
          :separator="item.separator"
        ></DrawerListItem>
      </template>
    </q-list>
    <div
      class="row justify-center items-end absolute-bottom q-mb-sm q-gutter-x-sm"
    >
      <div>Lavurso</div>
      <q-btn
        href="https://github.com/annusingmar/lavurso"
        target="_blank"
        label="Source Code"
        icon="build"
        dense
        square
        size="sm"
      ></q-btn>
    </div>
  </q-drawer>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useUserStore } from "../stores/user.js";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "src/boot/axios.js";
import { useRouter } from "vue-router";
import DrawerListItem from "./DrawerListItem.vue";

const $q = useQuasar();
const router = useRouter();
const i18n = useI18n({ useScope: "global" });

const { name, role, roleName, session_id, clearUser } = useUserStore();

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["setLeftDrawer"]);

const menuItems = [
  {
    title: "Home",
    icon: "home",
    to: "/home",
    separator: false,
  },
  {
    title: "Account",
    icon: "settings",
    to: "/account",
    separator: false,
  },
  {
    title: "Messages",
    icon: "chat",
    to: "/messages",
    separator: true,
  },
];

const studentMenuItems = [
  {
    title: "Lessons and Marks",
    icon: "grade",
    to: "/student/journals",
  },
];

const teacherMenuItems = [
  {
    title: role === "admin" ? "Journals" : "My Journals",
    icon: "library_books",
    to: "/teacher/journals",
    separator: false,
  },
  {
    title: role === "admin" ? "Classes" : "My Classes",
    icon: "class",
    to: "/teacher/classes",
    separator: role === "admin" ? true : false,
  },
];

const adminMenuItems = [
  {
    title: "Users",
    icon: "account_circle",
    to: "/admin/users",
    separator: false,
  },
  {
    title: "Groups",
    icon: "groups",
    to: "/admin/groups",
    separator: false,
  },
  {
    title: "Classes",
    icon: "class",
    to: "/admin/classes",
    separator: false,
  },
  {
    title: "Grades",
    icon: "tag",
    to: "/admin/grades",
    separator: false,
  },
  {
    title: "Subjects",
    icon: "format_list_numbered",
    to: "/admin/subjects",
    separator: false,
  },
];

const changeDarkMode = (val) => $q.dark.set(val);

const lang = ref(i18n.locale.value);

const availableLanguages = [
  {
    label: "eesti",
    value: "et",
  },
  {
    label: "English",
    value: "en-US",
  },
];

watch(lang, () => {
  i18n.locale.value = lang.value.value;
  if (lang.value.value === "en-US") {
    import(`../../node_modules/quasar/lang/en-US.js`).then((l) =>
      $q.lang.set(l.default)
    );
  } else if (lang.value.value === "et") {
    import(`../../node_modules/quasar/lang/et.js`).then((l) =>
      $q.lang.set(l.default)
    );
  }
});

const drawerStateChange = (val) => {
  emit("setLeftDrawer", val);
};

const logoutLoading = ref(false);
const logOut = async () => {
  logoutLoading.value = true;
  try {
    await api.delete("/sessions/" + session_id);
    clearUser();
    router.replace("/login");
  } catch (error) {
    console.log("fail");
  } finally {
    logoutLoading.value = false;
  }
};
</script>
