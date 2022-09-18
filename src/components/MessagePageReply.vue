<template>
  <div v-if="!showReplyBox" class="row justify-end">
    <q-btn
      color="primary"
      :label="t('messages.reply')"
      @click="toggleReplyBox"
    ></q-btn>
  </div>
  <div v-else class="q-gutter-y-sm">
    <q-input
      v-model="userReply"
      square
      outlined
      autogrow
      :input-style="[{ 'min-height': '5rem' }, { overflow: 'hidden' }]"
    ></q-input>
    <div class="row justify-end q-gutter-sm">
      <q-btn :label="t('cancel')" @click="showReplyBox = false"></q-btn>
      <q-btn
        color="primary"
        :label="t('messages.send')"
        icon-right="send"
        :loading="sendLoading"
        :disabled="replyButtonDisable"
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
const userReply = ref("");

const toggleReplyBox = () => {
  showReplyBox.value = !showReplyBox.value;
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
    emit("refreshThread");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("messages.sendingMessageFailed"),
      timeout: 6000,
    });
  } finally {
    sendLoading.value = false;
  }
};
</script>
