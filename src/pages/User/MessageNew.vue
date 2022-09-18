<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-10">
        <q-card>
          <q-card-section class="q-pb-none">
            <div class="text-h4">{{ t("messages.newMessage") }}</div>
          </q-card-section>
          <q-card-section class="q-pt-md q-pb-none q-gutter-y-md">
            <q-input
              v-model="title"
              square
              outlined
              :label="t('messages.title')"
            ></q-input>
            <q-input
              v-model="message"
              square
              outlined
              autogrow
              :input-style="[{ 'min-height': '10rem' }, { overflow: 'hidden' }]"
            ></q-input>
            <div class="row q-col-gutter-x-md q-col-gutter-y-sm">
              <div class="col-sm col-xs-12">
                <q-select
                  v-model="chosenUsers"
                  filled
                  multiple
                  use-chips
                  use-input
                  input-debounce="200"
                  stack-label
                  :label="t('users')"
                  :options="availableUsers"
                  option-label="name"
                  option-value="id"
                  :hint="t('minimumNCharacters', ['4'])"
                  @filter="usersFilter"
                >
                  <template #option="scope">
                    <q-item v-bind="scope.itemProps">
                      <q-item-section>
                        <q-item-label>{{ scope.opt.name }}</q-item-label>
                        <q-item-label
                          v-if="scope.opt.role !== 'student'"
                          caption
                          >{{ t(`roles.${scope.opt.role}`) }}</q-item-label
                        >
                        <q-item-label v-else caption
                          >{{ t(`roles.${scope.opt.role}`)
                          }}{{
                            scope.opt.class.display_name
                              ? ` - ${scope.opt.class.display_name}`
                              : ""
                          }}</q-item-label
                        >
                      </q-item-section>
                    </q-item>
                  </template>
                </q-select>
              </div>
              <div class="col-sm col-xs-12">
                <q-select
                  v-model="chosenGroups"
                  filled
                  multiple
                  use-chips
                  use-input
                  input-debounce="200"
                  stack-label
                  :label="t('groups')"
                  :options="filteredGroups"
                  option-label="name"
                  option-value="id"
                  @filter="groupsFilter"
                ></q-select>
              </div>
            </div>
          </q-card-section>
          <q-card-section class="q-pt-sm">
            <div class="row justify-end">
              <q-btn
                color="primary"
                :label="t('messages.send')"
                icon-right="send"
                :disable="sendButtonDisabled"
                :loading="sendLoading"
                class="q-mt-md"
                @click="sendMessage"
              ></q-btn>
            </div>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "src/stores/user";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const router = useRouter();
const { t } = useI18n({ useScope: "global" });
const { id } = useUserStore();

const usersFilter = async (val, update, abort) => {
  if (val.length < 4) {
    abort();
    return;
  }
  await getUsers(val);
  update();
};

const filteredGroups = ref(null);
const groupsFilter = async (val, update) => {
  if (availableGroups.value !== null) {
    update(() => {
      const v = val.toLowerCase();
      filteredGroups.value = availableGroups.value.filter(
        (g) => g.name.toLowerCase().indexOf(v) > -1
      );
    });
  } else {
    await getGroups();
    update(() => {
      filteredGroups.value = availableGroups.value;
    });
  }
};

const availableUsers = ref(null);
const getUsers = async (search) => {
  try {
    const response = await api.get("/users/search", {
      params: {
        name: search,
      },
    });
    availableUsers.value =
      response.data.result !== null
        ? response.data.result.filter((u) => u.id !== id)
        : [];
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

const availableGroups = ref(null);
const getGroups = async () => {
  try {
    const response = await api.get("/users/" + id + "/groups");
    availableGroups.value =
      response.data.groups !== null ? response.data.groups : [];
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

const sendLoading = ref(false);

const sendButtonDisabled = computed(
  () => !(title.value.trim() !== "" && message.value.trim() !== "")
);

const title = ref("");
const message = ref("");
const chosenUsers = ref([]);
const chosenGroups = ref([]);

const sendMessage = async () => {
  const userIDs = [];
  const groupIDs = [];
  chosenUsers.value.forEach((u) => userIDs.push(u.id));
  chosenGroups.value.forEach((g) => groupIDs.push(g.id));
  sendLoading.value = true;
  try {
    const response = await api.post("/threads", {
      title: title.value,
      body: message.value,
      user_ids: userIDs,
      group_ids: groupIDs,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: t("messages.sendingMessageSucceeded"),
      timeout: 3000,
    });
    router.replace("/messages/" + response.data.thread.id);
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
    sendLoading.value = false;
  }
};
</script>
