<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: 90vh">
      <div class="col-10">
        <q-card v-if="!loading">
          <MessagePageThread
            :thread="thread"
            @refresh-thread="getThread"
          ></MessagePageThread>
          <q-card-section>
            <div class="q-gutter-y-md">
              <MessageContentItem
                v-for="msg in messages"
                :key="msg.id"
                :msg="msg"
                @refresh-thread="getThread"
              ></MessageContentItem>
            </div>
          </q-card-section>
          <q-card-section v-if="!thread.content.locked">
            <MessagePageReply
              @refresh-thread="getThread"
              :id="thread.content.id"
            ></MessagePageReply>
          </q-card-section>
          <q-card-section v-else>
            <div class="row justify-center">
              <div class="subtitle-1">Thread locked.</div>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, reactive } from "vue";
import { useRouter } from "vue-router";

import MessageContentItem from "src/components/MessageContentItem.vue";
import MessagePageThread from "src/components/MessagePageThread.vue";
import MessagePageReply from "src/components/MessagePageReply.vue";

export default {
  name: "MessagePage",
  props: ["id"],
  setup(props) {
    const $q = useQuasar();
    const router = useRouter();

    const thread = reactive({ content: {} });
    const messages = ref([]);
    const loading = ref(true);
    const getThread = async () => {
      loading.value = true;
      try {
        const response = await api.get("/threads/" + props.id);
        thread.content = response.data.thread;
        messages.value = response.data.messages;
      } catch (error) {
        if (error.response && error.response.status == 404) {
          router.replace("/notFound");
        } else {
          $q.notify({
            type: "negative",
            position: "top",
            message: "Loading of data failed",
            timeout: 0,
          });
        }
      } finally {
        loading.value = false;
      }
    };

    getThread();

    return {
      thread,
      messages,
      loading,
      getThread,
    };
  },
  components: { MessageContentItem, MessagePageThread, MessagePageReply },
};
</script>

<style scoped>
.editorError {
  border: 2px solid;
  border-color: red;
  border-radius: 5px;
}
</style>
