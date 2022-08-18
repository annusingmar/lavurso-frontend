<template>
  <q-card-section>
    <div class="row q-gutter-x-md q-gutter-y-md">
      <div class="text-h4">{{ thread.content.title }}</div>
      <q-btn
        color="info"
        :label="t('messages.members')"
        :to="'/messages/' + thread.content.id + '/members'"
      ></q-btn>
      <q-btn
        v-if="userID === thread.content.user.id && !thread.content.locked"
        color="warning"
        :label="t('messages.lock')"
        :loading="lockLoading"
        @click="lockThread"
      ></q-btn>
      <q-btn
        v-else-if="userID === thread.content.user.id && thread.content.locked"
        color="secondary"
        :label="t('messages.unlock')"
        :loading="unlockLoading"
        @click="unlockThread"
      ></q-btn>
      <q-btn
        v-if="userID === thread.content.user.id"
        color="negative"
        :label="t('messages.delete')"
        :loading="deleteLoading"
        @click="deleteThreadPrompt"
      ></q-btn>
    </div>
  </q-card-section>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const router = useRouter();
const { t } = useI18n({ useScope: "global" });
const userStore = storeToRefs(useUserStore());
const props = defineProps({
  thread: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["refreshThread"]);

const userID = userStore.id;

const lockLoading = ref(false);
const lockThread = async () => {
  lockLoading.value = true;
  try {
    await api.put("/threads/" + props.thread.content.id + "/lock");
    $q.notify({
      type: "positive",
      position: "top",
      message: t("messages.lockingThreadSucceeded"),
      timeout: 3000,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("messages.lockingThreadFailed"),
      timeout: 6000,
    });
  } finally {
    lockLoading.value = false;
    emit("refreshThread");
  }
};

const unlockLoading = ref(false);
const unlockThread = async () => {
  unlockLoading.value = true;
  try {
    await api.put("/threads/" + props.thread.content.id + "/unlock");
    $q.notify({
      type: "positive",
      position: "top",
      message: t("messages.unlockingThreadSucceeded"),
      timeout: 3000,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("messages.unlockingThreadFailed"),
      timeout: 6000,
    });
  } finally {
    unlockLoading.value = false;
    emit("refreshThread");
  }
};

const deleteLoading = ref(false);
const deleteThread = async () => {
  deleteLoading.value = true;
  try {
    await api.delete("/threads/" + props.thread.content.id);
    $q.notify({
      type: "positive",
      position: "top",
      message: t("messages.deletingThreadSucceeded"),
      timeout: 3000,
    });
    router.replace("/messages");
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("messages.deletingThreadFailed"),
      timeout: 6000,
    });
    deleteLoading.value = false;
  }
};

const deleteThreadPrompt = () => {
  $q.dialog({
    title: "Confirm",
    message: t("messages.deleteThreadConfirm"),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteThread();
  });
};
</script>
