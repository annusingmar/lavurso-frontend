<template>
  <div class="row flex-center" style="height: 90vh">
    <div class="col-10">
      <q-card v-if="!loading">
        <q-card-section>
          <div class="row q-gutter-x-md">
            <div class="text-h4">{{ thread.content.title }}</div>
            <q-btn
              v-if="userID === thread.content.user_id"
              color="negative"
              label="delete"
              :loading="deleteLoading"
              @click="deleteThreadPrompt"
            ></q-btn>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="q-gutter-y-md">
            <MessageContentItem
              v-for="msg in messages.list"
              :key="msg.id"
              :msg="msg"
              @refresh-messages="getThread"
            ></MessageContentItem>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import MessageContentItem from "src/components/MessageContentItem.vue";
import { ref, reactive } from "vue";
import { useUserStore } from "src/stores/user";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";

export default {
  name: "MessagePage",
  props: ["id"],
  setup(props) {
    const $q = useQuasar();
    const { userID } = storeToRefs(useUserStore());
    const thread = reactive({ content: {} });
    const messages = reactive({ list: [] });
    const loading = ref(true);
    const deleteLoading = ref(false);
    const router = useRouter();

    const getThread = () => {
      $q.loading.show();
      api
        .get("/threads/" + props.id)
        .then((response) => {
          thread.content = response.data.thread;
          messages.list = response.data.messages;
          loading.value = false;
          $q.loading.hide();
        })
        .catch((error) => {
          $q.loading.hide();
          $q.notify({
            type: "negative",
            position: "top",
            message: "Loading of data failed",
            timeout: 0,
          });
        });
    };

    const deleteThread = () => {
      deleteLoading.value = true;
      api
        .delete("/threads/" + props.id)
        .then((response) => {
          $q.notify({
            type: "positive",
            position: "top",
            message: "Deleting thread succeeded!",
            timeout: 3000,
          });
          router.replace("/messages");
        })
        .catch((error) => {
          $q.notify({
            type: "negative",
            position: "top",
            message: "Deleting thread failed",
            timeout: 6000,
          });
          deleteLoading.value = false;
        });
    };

    const deleteThreadPrompt = () => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure you want to delete this thread?",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        deleteThread();
      });
    };

    getThread();

    return {
      thread,
      messages,
      loading,
      userID,
      deleteLoading,
      getThread,
      deleteThreadPrompt,
    };
  },
  components: { MessageContentItem, MessageContentItem },
};
</script>
