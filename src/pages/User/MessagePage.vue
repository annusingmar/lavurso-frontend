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
              v-for="msg in messages"
              :key="msg.id"
              :msg="msg"
              @refresh-messages="getThread"
            ></MessageContentItem>
          </div>
        </q-card-section>
        <q-card-section v-if="!thread.content.locked">
          <div class="row justify-end" v-if="!showReplyBox">
            <q-btn
              color="primary"
              label="Reply"
              @click="toggleReplyBox"
            ></q-btn>
          </div>
          <div v-else>
            <q-editor
              ref="editorRef"
              @paste="onPaste"
              v-model="userReply"
              :class="{ editorError }"
              :toolbar="[
                ['bold', 'italic', 'strike', 'underline'],
                ['undo', 'redo'],
              ]"
              min-height="5rem"
            ></q-editor>
            <div class="text-subtitle2 q-mt-sm" v-if="editorError">
              Message content cannot be empty
            </div>
            <div class="row justify-end">
              <q-btn
                color="primary"
                label="Send"
                icon-right="send"
                :loading="sendLoading"
                @click="sendMessage"
                class="q-mt-md"
              ></q-btn>
            </div>
          </div>
        </q-card-section>
        <q-card-section v-else>
          <div class="row justify-center">
            <div class="subtitle-1">Thread locked.</div>
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
    const router = useRouter();
    const { userID } = storeToRefs(useUserStore());

    const showReplyBox = ref(false);
    const editorRef = ref(null);
    const userReply = ref("");

    const thread = reactive({ content: {} });
    const messages = ref([]);
    const loading = ref(true);
    const getThread = async () => {
      $q.loading.show();
      try {
        const response = await api.get("/threads/" + props.id);
        thread.content = response.data.thread;
        messages.value = response.data.messages;
        loading.value = false;
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
        $q.loading.hide();
      }
    };

    const deleteLoading = ref(false);
    const deleteThread = async () => {
      deleteLoading.value = true;
      try {
        await api.delete("/threads/" + props.id);
        $q.notify({
          type: "positive",
          position: "top",
          message: "Deleting thread succeeded!",
          timeout: 3000,
        });
        router.replace("/messages");
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Deleting thread failed",
          timeout: 6000,
        });
        deleteLoading.value = false;
      }
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

    const toggleReplyBox = () => {
      showReplyBox.value = !showReplyBox.value;
    };

    const onPaste = (event) => {
      if (event.target.nodeName === "INPUT") return;
      let text, onPasteStripFormattingIEPaste;
      event.preventDefault();
      event.stopPropagation();
      if (event.originalEvent && event.originalEvent.clipboardData.getData) {
        text = event.originalEvent.clipboardData.getData("text/plain");
        editorRef.value.runCmd("insertText", text);
      } else if (event.clipboardData && event.clipboardData.getData) {
        text = event.clipboardData.getData("text/plain");
        editorRef.value.runCmd("insertText", text);
      } else if (window.clipboardData && window.clipboardData.getData) {
        if (!onPasteStripFormattingIEPaste) {
          onPasteStripFormattingIEPaste = true;
          editorRef.value.runCmd("ms-pasteTextOnly", text);
        }
        onPasteStripFormattingIEPaste = false;
      }
    };

    const editorError = ref(false);
    const sendLoading = ref(false);
    const sendMessage = async () => {
      if (userReply.value.trim() === "") {
        editorError.value = true;
        return;
      }
      sendLoading.value = true;
      try {
        await api.post("/threads/" + props.id + "/messages", {
          body: userReply.value,
        });
        $q.notify({
          type: "positive",
          position: "top",
          message: "Sending message succeeded!",
          timeout: 3000,
        });
        userReply.value = "";
        showReplyBox.value = false;
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Sending message failed",
          timeout: 6000,
        });
      } finally {
        sendLoading.value = false;
        getThread();
      }
    };

    getThread();

    return {
      thread,
      messages,
      loading,
      userID,
      deleteLoading,
      showReplyBox,
      userReply,
      editorRef,
      sendLoading,
      editorError,
      getThread,
      deleteThreadPrompt,
      toggleReplyBox,
      sendMessage,
      onPaste,
    };
  },
  components: { MessageContentItem, MessageContentItem },
};
</script>

<style scoped>
.editorError {
  border: 2px solid;
  border-color: red;
  border-radius: 5px;
}
</style>
