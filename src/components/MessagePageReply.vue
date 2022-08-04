<template>
  <div class="row justify-end" v-if="!showReplyBox">
    <q-btn color="primary" label="Reply" @click="toggleReplyBox"></q-btn>
  </div>
  <div v-else>
    <q-editor
      ref="editorRef"
      @paste="onPaste"
      v-model="userReply"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['undo', 'redo'],
      ]"
      min-height="5rem"
    ></q-editor>
    <div class="row justify-end">
      <q-btn
        color="primary"
        label="Send"
        icon-right="send"
        :loading="sendLoading"
        :disabled="replyButtonDisable"
        @click="sendMessage"
        class="q-mt-md"
      ></q-btn>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, computed } from "vue";
import { onEditorPaste } from "src/composables/editor";

const $q = useQuasar();
const props = defineProps(["id"]);
const emit = defineEmits(["refreshThread"]);

const showReplyBox = ref(false);
const editorRef = ref(null);
const userReply = ref("");

const toggleReplyBox = () => {
  showReplyBox.value = !showReplyBox.value;
};

const onPaste = (event) => {
  onEditorPaste(event, editorRef);
};

const replyButtonDisable = computed(() =>
  userReply.value.trim() === "" || userReply.value.trim() === "<br>"
    ? true
    : false
);

const sendLoading = ref(false);
const sendMessage = async () => {
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
    emit("refreshThread");
  }
};
</script>
