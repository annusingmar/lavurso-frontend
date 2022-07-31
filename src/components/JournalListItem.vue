<template>
  <q-item clickable v-ripple :to="'/teacher/journals/' + journal.id">
    <div class="row justify-between items-center" style="width: 100%">
      <div>
        <q-item-section avatar>
          <q-item-label>{{ journal.subject.name }}</q-item-label>
        </q-item-section>
      </div>
      <div>
        <q-item-section main>{{ journal.name }} </q-item-section>
      </div>
      <div>
        <q-item-section side>
          <div class="text-caption">{{ journal.teacher.name }}</div>
        </q-item-section>
      </div>
    </div>
  </q-item>
</template>

<script>
export default {
  name: "JournalListItem",
  props: ["journal"],
  setup() {},
};
</script>
