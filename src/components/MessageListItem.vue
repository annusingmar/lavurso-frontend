<template>
  <q-item clickable v-ripple class="q-mb-sm">
    <div class="row justify-between items-center" style="width: 100%">
      <div class="col-xl-2 col-md-2 col-sm-12 col-xs-12">
        <q-item-section>
          <!-- <q-badge color="red" style="max-width: 5em" class="q-mb-sm"
                      >UNREAD</q-badge
                    > -->
          <q-item-label>{{ msg.user.name }}</q-item-label>
          <q-item-label caption>{{ formatDate }}</q-item-label>
        </q-item-section>
      </div>
      <div class="col-xl-9 col-md-9 col-sm-12 col-xs-12">
        <q-item-section>{{ msg.title }} </q-item-section>
      </div>
      <div class="col-xl-1 col-md-1 col-sm-12 col-xs-12">
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
import { computed } from "vue";

export default {
  name: "MessageListItem",
  props: ["msg"],
  setup(props) {
    console.log(props.msg);
    const formatDate = computed(() => {
      return new Date(props.msg.created_at).toLocaleString("et");
    });
    return {
      formatDate,
    };
  },
};
</script>
