<template>
  <div class="row flex-center" style="height: 90vh">
    <div class="col-10">
      <q-card v-if="!loading">
        <q-card-section>
          <div class="text-h4">{{ thread.content.title }}</div>
        </q-card-section>
        <q-card-section>
          <div class="q-gutter-y-md">
            <MessageContentItem
              v-for="msg in messages.list"
              :key="msg.id"
              :msg="msg"
              @refresh-messages="getThread"
            ></MessageContentItem>
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

export default {
  name: "MessagePage",
  props: ["id"],
  setup(props) {
    const $q = useQuasar();
    const thread = reactive({ content: {} });
    const messages = reactive({ list: [] });
    const loading = ref(true);

    const getThread = () => {
      $q.loading.show();
      api
        .get("/threads/" + props.id)
        .then((response) => {
          thread.content = response.data.thread;
          messages.list = response.data.messages;
          loading.value = false;
          $q.loading.hide();
        })
        .catch((error) => {
          $q.loading.hide();
          $q.notify({
            type: "negative",
            position: "top",
            message: "Loading of data failed",
            timeout: 0,
          });
        });
    };

    getThread();

    return { thread, messages, loading, getThread };
  },
  components: { MessageContentItem, MessageContentItem },
};
</script>
