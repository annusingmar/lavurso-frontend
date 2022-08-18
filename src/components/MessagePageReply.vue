<template>
  <div v-if="!showReplyBox" class="row justify-end">
    <q-btn
      color="primary"
      :label="t('messages.reply')"
      @click="toggleReplyBox"
    ></q-btn>
  </div>
  <div v-else>
    <q-editor
      ref="editorRef"
      v-model="userReply"
      :toolbar="[
        ['bold', 'italic', 'strike', 'underline'],
        ['undo', 'redo'],
      ]"
      min-height="5rem"
      @paste="onPaste"
    ></q-editor>
    <div class="row justify-end">
      <q-btn
        color="primary"
        :label="t('messages.send')"
        icon-right="send"
        :loading="sendLoading"
        :disabled="replyButtonDisable"
        class="q-mt-md"
        @click="sendMessage"
      ></q-btn>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { onEditorPaste } from "src/composables/editor";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});
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
      message: t("messages.sendingMessageSucceeded"),
      timeout: 3000,
    });
    userReply.value = "";
    showReplyBox.value = false;
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("messages.sendingMessageFailed"),
      timeout: 6000,
    });
  } finally {
    sendLoading.value = false;
    emit("refreshThread");
  }
};
</script>
