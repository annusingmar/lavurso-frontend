<template>
  <div class="row flex-center" style="height: 90vh">
    <div class="col-10">
      <q-card>
        <q-card-section>
          <div class="row justify-between">
            <div class="text-h4">Messages</div>
            <div class="row q-gutter-x-sm">
              <q-btn
                label="refresh"
                @click="getMessages"
                :loading="loading"
              ></q-btn>
              <q-btn label="new" color="primary" to="/messages/new"></q-btn>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <q-list separator v-if="messages.list">
            <MessageListItem
              v-for="msg in messages.list"
              :key="msg.id"
              :msg="msg"
            ></MessageListItem>
          </q-list>
          <div v-else>No messages found.</div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { reactive, ref } from "vue";
import { useUserStore } from "src/stores/user";
import { storeToRefs } from "pinia";
import MessageListItem from "src/components/MessageListItem.vue";

export default {
  name: "MessageList",
  setup() {
    const $q = useQuasar();
    const loading = ref(true);
    const messages = reactive({ list: [] });
    const { id } = storeToRefs(useUserStore());
    const getMessages = () => {
      loading.value = true;
      api
        .get("/users/" + id.value + "/threads")
        .then((response) => {
          messages.list = response.data.threads;
          loading.value = false;
        })
        .catch((error) => {
          $q.notify({
            type: "negative",
            position: "top",
            message: "Loading of data failed",
            timeout: 0,
          });
        });
    };
    getMessages();
    return { messages, getMessages, loading };
  },
  components: { MessageListItem },
};
</script>

<style scoped>
.unread-border {
  border: 2px;
  border-style: groove;
  border-color: rgba(245, 29, 29, 0.897);
}
</style>
