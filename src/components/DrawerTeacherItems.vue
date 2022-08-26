<template>
  <DrawerListItem
    :title="role === 'admin' ? 'Journals' : 'My Journals'"
    icon="library_books"
    to="/teacher/journals"
  ></DrawerListItem>
  <DrawerListItem
    :title="role === 'admin' ? 'Classes' : 'My Classes'"
    icon="class"
    to="/teacher/classes"
    :separator="role === 'admin' ? true : false"
  ></DrawerListItem>
</template>

<script setup>
import DrawerListItem from "./DrawerListItem.vue";

const props = defineProps({
  role: {
    type: String,
    required: true,
  },
});
</script>
