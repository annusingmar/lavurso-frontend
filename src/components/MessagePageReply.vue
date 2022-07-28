<template>
  <div class="row justify-end" v-if="!showReplyBox">
    <q-btn color="primary" label="Reply" @click="toggleReplyBox"></q-btn>
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
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";

export default {
  name: "MessagePageReply",
  emits: ["refreshThread"],
  props: ["id"],
  setup(props, context) {
    const $q = useQuasar();

    const showReplyBox = ref(false);
    const editorRef = ref(null);
    const userReply = ref("");

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
        context.emit("refreshThread");
      }
    };

    return {
      showReplyBox,
      editorRef,
      editorError,
      sendLoading,
      userReply,
      toggleReplyBox,
      onPaste,
      sendMessage,
    };
  },
};
</script>
