<template>
  <q-drawer show-if-above :model-value="open" side="left" bordered elevated>
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
      <DrawerListItem
        v-for="(item, index) in menuItems"
        :title="item.title"
        :icon="item.icon"
        :to="item.to"
        :separator="item.separator"
        :key="index"
      ></DrawerListItem>
      <template v-if="userRole === 'admin' || userRole === 'teacher'">
        <DrawerListItem
          v-for="(item, index) in teacherMenuItems"
          :title="item.title"
          :icon="item.icon"
          :to="item.to"
          :separator="item.separator"
          :key="index"
        ></DrawerListItem>
      </template>
      <template v-if="userRole === 'admin'">
        <DrawerListItem
          v-for="(item, index) in adminMenuItems"
          :title="item.title"
          :icon="item.icon"
          :to="item.to"
          :separator="item.separator"
          :key="index"
        ></DrawerListItem>
      </template>
    </q-list>
  </q-drawer>
</template>

<script>
import { storeToRefs } from "pinia";

import DrawerListItem from "./DrawerListItem.vue";
import { useUserStore } from "../stores/user.js";

export default {
  components: {
    DrawerListItem,
  },
  props: ["open"],
  setup() {
    const userStoreRef = storeToRefs(useUserStore());

    const userName = userStoreRef.name;
    const userRole = userStoreRef.role;

    const menuItems = [
      {
        title: "Home",
        icon: "home",
        to: "/",
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
        title: "Journals",
        icon: "library_books",
        to: "/admin/journals",
        separator: true,
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
        title: "Grades",
        icon: "tag",
        to: "/admin/grades",
        separator: false,
      },
      {
        title: "Subjects",
        icon: "format_list_numbered",
        to: "/admin/subjects",
        separator: true,
      },
    ];

    return {
      userName,
      userDisplayRole: userStoreRef.roleName,
      userRole,
      menuItems,
      teacherMenuItems,
      adminMenuItems,
    };
  },
};
</script>
