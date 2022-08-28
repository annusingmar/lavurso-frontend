<template>
  <DrawerListItem
    :title="t('users')"
    to="/admin/users"
    icon="account_circle"
  ></DrawerListItem>
  <DrawerListItem
    :title="t('groups')"
    to="/admin/groups"
    icon="groups"
  ></DrawerListItem>
  <DrawerListItem
    :title="t('learning.class_es')"
    to="/admin/classes"
    icon="class"
  ></DrawerListItem>
  <DrawerListItem
    :title="t('learning.grade_s')"
    to="/admin/grades"
    icon="tag"
  ></DrawerListItem>
  <DrawerListItem
    :title="t('learning.subjects')"
    to="/admin/subjects"
    icon="format_list_numbered"
  ></DrawerListItem>
</template>

<script setup>
import DrawerListItem from "./DrawerListItem.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
</script>
