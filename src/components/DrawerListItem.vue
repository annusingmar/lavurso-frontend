<template>
  <q-item v-ripple clickable tag="a" :to="to">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon">
        <q-badge
          v-if="redBadge"
          color="red"
          floating
          rounded
          class="q-py-none"
        ></q-badge>
      </q-icon>
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label v-if="caption" caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
  <q-separator v-if="separator" />
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "DrawerListItem",
  props: {
    title: {
      type: String,
      required: true,
    },
    caption: {
      type: String,
      required: false,
      default: null,
    },
    to: {
      type: String,
      required: true,
    },
    icon: {
      type: String,
      required: false,
      default: null,
    },
    separator: {
      type: Boolean,
      required: false,
      default: false,
    },
    redBadge: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
});
</script>
