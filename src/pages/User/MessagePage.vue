<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-10">
        <q-card v-if="thread && thread.content.id">
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
              :id="thread.content.id"
              @refresh-thread="getThread"
            ></MessagePageReply>
          </q-card-section>
          <q-card-section v-else>
            <div class="row justify-center">
              <div class="subtitle-1">{{ t("messages.threadLocked") }}</div>
            </div>
          </q-card-section>
          <q-inner-loading :showing="loading"></q-inner-loading>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, reactive } from "vue";
import { useI18n } from "vue-i18n";

import MessageContentItem from "src/components/MessageContentItem.vue";
import MessagePageThread from "src/components/MessagePageThread.vue";
import MessagePageReply from "src/components/MessagePageReply.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const thread = reactive({ content: {} });
const messages = ref([]);
const loading = ref(true);
const getThread = async () => {
  loading.value = true;
  try {
    const response = await api.get("/threads/" + props.id);
    thread.content = response.data.thread;
    messages.value = response.data.messages;
    loading.value = false;
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("dataLoadingFail"),
      timeout: 0,
      actions: [{ label: t("dismiss"), color: "white" }],
    });
  }
};

getThread();
</script>

<style scoped>
.editorError {
  border: 2px solid;
  border-color: red;
  border-radius: 5px;
}
</style>
