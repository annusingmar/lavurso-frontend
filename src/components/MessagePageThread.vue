<template>
  <q-card-section>
    <div class="row q-gutter-x-md">
      <div class="text-h4">{{ thread.content.title }}</div>
      <q-btn
        color="info"
        label="members"
        :to="'/messages/' + thread.content.id + '/members'"
      ></q-btn>
      <q-btn
        v-if="userID === thread.content.user.id && !thread.content.locked"
        color="warning"
        label="lock"
        :loading="lockLoading"
        @click="lockThread"
      ></q-btn>
      <q-btn
        v-else-if="userID === thread.content.user.id && thread.content.locked"
        color="secondary"
        label="unlock"
        :loading="unlockLoading"
        @click="unlockThread"
      ></q-btn>
      <q-btn
        v-if="userID === thread.content.user.id"
        color="negative"
        label="delete"
        :loading="deleteLoading"
        @click="deleteThreadPrompt"
      ></q-btn>
    </div>
  </q-card-section>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import { ref } from "vue";

export default {
  name: "MessagePageThread",
  props: ["id", "thread"],
  emits: ["refreshThread"],
  setup(props, context) {
    const $q = useQuasar();
    const router = useRouter();
    const userStore = storeToRefs(useUserStore());

    const lockLoading = ref(false);
    const lockThread = async () => {
      lockLoading.value = true;
      try {
        await api.put("/threads/" + props.thread.content.id + "/lock");
        $q.notify({
          type: "positive",
          position: "top",
          message: "Locking thread succeeded!",
          timeout: 3000,
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Locking thread failed",
          timeout: 6000,
        });
      } finally {
        lockLoading.value = false;
        context.emit("refreshThread");
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
          message: "Unlocking thread succeeded!",
          timeout: 3000,
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Unlocking thread failed",
          timeout: 6000,
        });
      } finally {
        unlockLoading.value = false;
        context.emit("refreshThread");
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

    return {
      unlockLoading,
      lockLoading,
      deleteLoading,
      userID: userStore.id,
      unlockThread,
      lockThread,
      deleteThreadPrompt,
    };
  },
};
</script>
