<template>
  <q-item clickable v-ripple :to="'/messages/' + msg.id">
    <div class="row justify-between items-center" style="width: 100%">
      <div>
        <q-item-section avatar>
          <q-badge
            color="red"
            style="max-width: 5em"
            class="q-mb-sm"
            v-if="!msg.read"
            >UNREAD</q-badge
          >
          <q-item-label>{{ msg.user.name }}</q-item-label>
          <q-item-label caption>{{ formatDate }}</q-item-label>
        </q-item-section>
      </div>
      <div>
        <q-item-section main>{{ msg.title }} </q-item-section>
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

<script>
import { date } from "quasar";
import { computed } from "vue";

export default {
  name: "MessageListItem",
  props: ["msg"],
  setup(props) {
    const formatDate = computed(() => {
      return date.formatDate(props.msg.created_at, "DD. MMM YYYY HH:mm");
    });
    return {
      formatDate,
    };
  },
};
</script>
