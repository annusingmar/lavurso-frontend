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
          <div class="text-weight-bold">{{ userName }}</div>
          <div>{{ userDisplayRole }}</div>
        </div>
        <div class="col-auto">
          <q-btn color="primary" text-color="white">Log out</q-btn>
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
      <!-- <q-item>
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
      </q-item> -->
      <q-separator></q-separator>
      <DrawerListItem
        v-for="(item, index) in menuItems"
        :key="index"
        :title="item.title"
        :icon="item.icon"
        :to="item.to"
        :separator="item.separator"
      ></DrawerListItem>
      <template v-if="userRole === 'admin' || userRole === 'teacher'">
        <DrawerListItem
          v-for="(item, index) in teacherMenuItems"
          :key="index"
          :title="item.title"
          :icon="item.icon"
          :to="item.to"
          :separator="item.separator"
        ></DrawerListItem>
      </template>
      <template v-if="userRole === 'admin'">
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
  </q-drawer>
</template>

<script setup>
import { useQuasar } from "quasar";
// import enUS from "quasar/lang/en-US";
// import et from "quasar/lang/et";
import { storeToRefs } from "pinia";
import { useUserStore } from "../stores/user.js";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import DrawerListItem from "./DrawerListItem.vue";

const $q = useQuasar();
const i18n = useI18n({ useScope: "global" });

const userStore = storeToRefs(useUserStore());
const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["setLeftDrawer"]);

const userName = userStore.name;
const userRole = userStore.role;
const userDisplayRole = userStore.roleName;

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

const teacherMenuItems = [
  {
    title: userRole.value === "admin" ? "Journals" : "My Journals",
    icon: "library_books",
    to: "/teacher/journals",
    separator: userRole.value === "admin" ? true : false,
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

// const lang = ref(i18n.locale);

// const availableLanguages = [
//   {
//     label: "Eesti keel",
//     value: "et",
//   },
//   {
//     label: "English",
//     value: "en-US",
//   },
// ];

// watch(lang, () => {
//   i18n.locale = lang.value.value;
//   if (lang.value.value === "en-US") {
//     $q.lang.set(enUS);
//   } else if (lang.value.value === "et") {
//     $q.lang.set(et);
//   }
// });

const drawerStateChange = (val) => {
  emit("setLeftDrawer", val);
};
</script>
