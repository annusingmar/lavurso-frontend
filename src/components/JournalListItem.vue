<template>
  <q-item clickable v-ripple :to="'/teacher/journals/' + journal.id">
    <q-item-section>
      <q-item-label overline>{{ journal.subject.name }}</q-item-label>
      <q-item-label>{{ journal.name }}</q-item-label>
    </q-item-section>
    <q-item-section side>
      <q-item-label caption>{{ journal.teacher.name }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script>
export default {
  name: "JournalListItem",
  props: ["journal"],
  setup() {},
};
</script>
