<template>
  <q-item v-ripple clickable :to="'/messages/' + msg.id">
    <div class="row justify-between items-center" style="width: 100%">
      <div>
        <q-item-section avatar>
          <q-badge
            v-if="!msg.read"
            color="red"
            style="max-width: 5em"
            class="q-mb-sm"
            >{{ t("messages.unread") }}</q-badge
          >
          <q-item-label>{{ msg.user.name }}</q-item-label>
          <q-item-label caption>{{ formatDate }}</q-item-label>
        </q-item-section>
      </div>
      <div>
        <q-item-section main>
          <q-item-label>{{ msg.title }}</q-item-label>
        </q-item-section>
      </div>
      <div>
        <q-item-section side>
          <div class="row">
            <div class="col-auto">
              <q-icon left name="chat_bubble_outline"></q-icon>
            </div>
            <div class="col-auto">{{ msg.message_count }}</div>
          </div>
        </q-item-section>
      </div>
    </div>
  </q-item>
</template>

<script setup>
import { date } from "quasar";
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  msg: {
    type: Object,
    required: true,
  },
});

const formatDate = computed(() => {
  return date.formatDate(props.msg.created_at, "DD. MMM YYYY HH:mm");
});
</script>
