<template>
  <q-item clickable ripple tag="a" :to="to">
    <q-item-section v-if="icon" avatar>
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
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
    to: {
      type: String,
      default: "",
    },
    icon: {
      type: String,
      default: "",
    },
    separator: {
      type: Boolean,
      default: false,
    },
  },
});
</script>
