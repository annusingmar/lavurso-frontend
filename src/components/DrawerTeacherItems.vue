<template>
  <DrawerListItem
    :title="
      role === 'admin' ? t('learning.journal_s') : t('learning.myJournals')
    "
    icon="library_books"
    to="/teacher/journals"
  ></DrawerListItem>
  <DrawerListItem
    :title="role === 'admin' ? t('learning.class_es') : t('learning.myClasses')"
    icon="class"
    to="/teacher/classes"
    :separator="role === 'admin' ? true : false"
  ></DrawerListItem>
</template>

<script setup>
import DrawerListItem from "./DrawerListItem.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

defineProps({
  role: {
    type: String,
    required: true,
  },
});
</script>
