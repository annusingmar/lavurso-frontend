<template>
  <DrawerListItem
    :title="t('learning.journal')"
    :to="'/students/' + id"
    :caption="name"
    icon="library_books"
  ></DrawerListItem>
  <DrawerListItem
    :title="t('sidebar.student.subjectsAndMarks')"
    :caption="name"
    :to="'/students/' + id + '/journals'"
    icon="grade"
    :separator="false"
  ></DrawerListItem>
  <DrawerListItem
    :title="t('sidebar.student.gradesByYear')"
    :caption="name"
    :to="'/students/' + id + '/grades'"
    icon="assignment_turned_in"
    :separator="true"
  ></DrawerListItem>
</template>

<script setup>
import DrawerListItem from "./DrawerListItem.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

defineProps({
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: false,
    default: null,
  },
});
</script>
