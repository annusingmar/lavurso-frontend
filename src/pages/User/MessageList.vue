<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-6 col-xs-10">
        <q-card>
          <q-card-section>
            <div class="row justify-between">
              <div class="text-h4 q-mr-sm">{{ t("messages.mailbox") }}</div>
              <div class="row q-gutter-x-sm">
                <q-input
                  v-model="search"
                  dense
                  :placeholder="t('search')"
                  :debounce="300"
                >
                  <template #append>
                    <q-icon name="search"></q-icon>
                  </template>
                </q-input>
                <q-btn
                  :label="t('messages.refresh')"
                  @click="getMessages"
                ></q-btn>
                <q-btn
                  :label="t('new')"
                  color="primary"
                  to="/messages/new"
                ></q-btn>
              </div>
            </div>
          </q-card-section>
          <q-card-section>
            <q-list v-if="messages && messages.length > 0" separator>
              <MessageListItem
                v-for="msg in messages"
                :key="msg.id"
                :msg="msg"
              ></MessageListItem>
            </q-list>
            <div v-else-if="!loading" class="row justify-center">
              {{ t("messages.noMessagesFound") }}
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
import { ref, watch } from "vue";
import { useUserStore } from "src/stores/user";
import { useI18n } from "vue-i18n";
import MessageListItem from "src/components/MessageListItem.vue";

const $q = useQuasar();
const loading = ref(true);
const messages = ref([]);
const { t } = useI18n({ useScope: "global" });
const { id } = useUserStore();

const search = ref("");

const getMessages = async () => {
  loading.value = true;
  try {
    let opts = {};

    if (search.value.trim() !== "") {
      opts = { params: { search: search.value } };
    }

    const response = await api.get("/users/" + id + "/threads", opts);
    messages.value =
      response.data.threads !== null ? response.data.threads : [];
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

watch(
  search,
  () => {
    if (search.value.trim().length > 3 || search.value === "") {
      getMessages();
    }
  },
  { immediate: true }
);
</script>

<style scoped>
.unread-border {
  border: 2px;
  border-style: groove;
  border-color: rgba(245, 29, 29, 0.897);
}
</style>
