<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar class="bg-primary text-white glossy">
      <q-btn dense ripple flat icon="menu" @click="$emit('toggleLeftDrawer')" />
      <q-toolbar-title> Lavurso </q-toolbar-title>
      <q-space />
      <q-btn
        href="https://github.com/annusingmar/lavurso"
        target="_blank"
        label="Source Code"
        icon="build"
        dense
        color="secondary"
        size="sm"
      ></q-btn>
    </q-toolbar>
  </q-header>
</template>

<script>
export default {
  name: "TheHeader",
  emits: ["toggleLeftDrawer"],
};
</script>
