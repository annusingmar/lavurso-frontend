<template>
  <q-card>
    <div class="row justify-start items-start">
      <div class="col-shrink">
        <q-card-section>
          <div class="text-subtitle2">{{ msg.user.name }}</div>
          <div class="text-caption">{{ createdAt }}</div>
          <q-btn
            v-if="msg.user.id === id && msg.thread_id"
            color="negative"
            label="Delete"
            class="q-mt-sm"
            @click="deleteMessagePrompt"
          ></q-btn>
        </q-card-section>
      </div>
      <div class="col-grow">
        <q-card-section>
          <div v-html="msg.body"></div>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { computed } from "vue";
import { useUserStore } from "src/stores/user";
import { storeToRefs } from "pinia";
import { api } from "src/boot/axios";

export default {
  name: "MessageContentItem",
  props: ["msg"],
  setup(props, context) {
    const $q = useQuasar();
    const { id } = storeToRefs(useUserStore());

    const createdAt = computed(() => {
      return new Date(props.msg.created_at).toLocaleString("et");
    });

    const deleteMessage = () => {
      api
        .delete("/messages/" + props.msg.id)
        .then((response) => {
          $q.notify({
            type: "positive",
            position: "top",
            message: "Deleting message succeeded!",
            timeout: 3000,
          });
        })
        .catch((error) => {
          $q.notify({
            type: "negative",
            position: "top",
            message: "Deleting message failed",
            timeout: 6000,
          });
        });
      context.emit("refreshMessages");
    };

    const deleteMessagePrompt = (id) => {
      $q.dialog({
        title: "Confirm",
        message: "Are you sure you want to delete this message?",
        cancel: true,
        persistent: true,
      }).onOk(() => {
        deleteMessage();
      });
    };

    return { createdAt, id, deleteMessagePrompt };
  },
};
</script>
