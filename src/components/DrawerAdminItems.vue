<template>
  <DrawerListItem
    title="Users"
    to="/admin/users"
    icon="account_circle"
  ></DrawerListItem>
  <DrawerListItem
    title="Groups"
    to="/admin/groups"
    icon="groups"
  ></DrawerListItem>
  <DrawerListItem
    title="Classes"
    to="/admin/classes"
    icon="class"
  ></DrawerListItem>
  <DrawerListItem title="Grades" to="/admin/grades" icon="tag"></DrawerListItem>
  <DrawerListItem
    title="Subjects"
    to="/admin/subjects"
    icon="format_list_numbered"
  ></DrawerListItem>
</template>

<script setup>
import DrawerListItem from "./DrawerListItem.vue";
</script>
