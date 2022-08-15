<template>
  <q-item v-ripple clickable :to="'/teacher/classes/' + classs.id">
    <q-item-section>
      <q-item-label>{{ classs.name }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-item-label caption>{{ classs.teacher.name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "ClassListItem",
  props: {
    classs: {
      type: Object,
      required: true,
    },
  },
};
</script>
