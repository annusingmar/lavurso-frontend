<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: 90vh">
      <div class="col-10">
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div class="text-h4">Messages</div>
              <div class="row q-gutter-x-sm">
                <q-btn
                  label="refresh"
                  :loading="loading"
                  @click="getMessages"
                ></q-btn>
                <q-btn label="new" color="primary" to="/messages/new"></q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-list v-if="messages.length > 0" separator>
              <MessageListItem
                v-for="msg in messages"
                :key="msg.id"
                :msg="msg"
              ></MessageListItem>
            </q-list>
            <div v-else>No messages found.</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useUserStore } from "src/stores/user";
import { storeToRefs } from "pinia";
import MessageListItem from "src/components/MessageListItem.vue";

const $q = useQuasar();
const loading = ref(true);
const messages = ref([]);
const { id } = storeToRefs(useUserStore());

const getMessages = async () => {
  loading.value = true;
  try {
    const response = await api.get("/users/" + id.value + "/threads");
    messages.value =
      response.data.threads !== null ? response.data.threads : [];
    loading.value = false;
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};
getMessages();
</script>

<style scoped>
.unread-border {
  border: 2px;
  border-style: groove;
  border-color: rgba(245, 29, 29, 0.897);
}
</style>
