<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar class="bg-primary text-white glossy">
      <q-btn dense ripple flat icon="menu" @click="$emit('toggleLeftDrawer')" />
      <q-toolbar-title> Lavurso </q-toolbar-title>
      <q-space />
      <q-btn
        href="https://github.com/annusingmar/lavurso"
        target="_blank"
        :label="t('sourceCode')"
        icon="build"
        dense
        color="secondary"
        size="sm"
      ></q-btn>
    </q-toolbar>
  </q-header>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const emit = defineEmits(["toggleLeftDrawer"]);

const { t } = useI18n({ useScope: "global" });
</script>
