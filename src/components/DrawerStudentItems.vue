<template>
  <DrawerListItem
    title="Latest"
    :to="'/students/' + id"
    :caption="name"
    icon="library_books"
  ></DrawerListItem>
  <DrawerListItem
    title="Lessons and Marks"
    :caption="name"
    :to="'/students/' + id + '/journals'"
    icon="grade"
    :separator="true"
  ></DrawerListItem>
</template>

<script setup>
import DrawerListItem from "./DrawerListItem.vue";

const props = defineProps({
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
