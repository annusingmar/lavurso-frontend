<template>
  <q-card>
    <div class="row justify-start items-start">
      <div class="col-shrink">
        <q-card-section>
          <div class="text-subtitle2">{{ msg.user.name }}</div>
          <div class="text-caption">{{ createdAt }}</div>
          <div v-if="updatedAt" class="text-caption">
            {{ t("edited") }} {{ updatedAt }}
          </div>
          <div v-if="msg.user.id === id" class="row q-col-gutter-x-md">
            <div
              v-if="msg.type !== 'thread_start'"
              class="col-sm-6 col-xs-12 q-mt-sm"
            >
              <q-btn
                color="negative"
                :label="t('delete')"
                size="sm"
                :loading="deleteMessageLoading"
                @click="deleteMessagePrompt"
              ></q-btn>
            </div>
            <div class="col-sm-6 col-xs-12 q-mt-sm">
              <q-btn
                color="secondary"
                :label="t('edit')"
                size="sm"
                @click="toggleMessageEditor"
              ></q-btn>
            </div>
          </div>
        </q-card-section>
      </div>
      <div class="col-grow">
        <q-card-section v-if="!messageEditorVisible">
          <div style="white-space: pre">{{ msg.body }}</div>
        </q-card-section>
        <q-card-section v-else>
          <q-input
            v-model="editorMessage"
            square
            outlined
            autogrow
            :input-style="[{ 'min-height': '5rem' }, { overflow: 'hidden' }]"
          ></q-input>
          <div class="row justify-end q-mt-sm">
            <q-btn
              color="primary"
              :loading="saveLoading"
              :disabled="saveButtonDisable"
              icon-right="save"
              :label="t('save')"
              @click="updateMessage"
            >
            </q-btn>
          </div>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script setup>
import { useQuasar, date } from "quasar";
import { computed, ref } from "vue";
import { useUserStore } from "src/stores/user";
import { api } from "src/boot/axios";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const { id } = useUserStore();
const props = defineProps({
  msg: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["refreshThread"]);

const createdAt = computed(() => {
  return date.formatDate(
    props.msg.created_at,
    "DD. MMM YYYY HH:mm",
    $q.lang.date
  );
});

const updatedAt = computed(() =>
  date.getDateDiff(
    new Date(props.msg.updated_at),
    new Date(props.msg.created_at),
    "seconds"
  )
    ? date.formatDate(props.msg.updated_at, "DD. MMM YYYY HH:mm", $q.lang.date)
    : null
);

// deleting message

const deleteMessageLoading = ref(false);
const deleteMessage = async () => {
  deleteMessageLoading.value = true;
  try {
    await api.delete("/messages/" + props.msg.id);
    $q.notify({
      type: "positive",
      position: "top",
      message: t("messages.deletingMessageSucceeded"),
      timeout: 3000,
    });
    emit("refreshThread");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("messages.deletingMessageFailed"),
      timeout: 6000,
    });
  } finally {
    deleteMessageLoading.value = false;
  }
};

const deleteMessagePrompt = () => {
  $q.dialog({
    title: t("confirm"),
    message: t("messages.deleteMessageConfirm"),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteMessage();
  });
};

// editing message

const messageEditorVisible = ref(false);
const editorMessage = ref("");
const saveLoading = ref(false);

const toggleMessageEditor = () => {
  editorMessage.value = props.msg.body;
  messageEditorVisible.value = !messageEditorVisible.value;
};

const saveButtonDisable = computed(() =>
  editorMessage.value.trim() === "" || editorMessage.value.trim() === "<br>"
    ? true
    : false
);

const updateMessage = async () => {
  saveLoading.value = true;
  try {
    await api.put("/messages/" + props.msg.id, {
      body: editorMessage.value,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: t("messages.savingMessageSucceeded"),
      timeout: 3000,
    });
    messageEditorVisible.value = false;
    emit("refreshThread");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("messages.savingMessageFailed"),
      timeout: 6000,
    });
  } finally {
    saveLoading.value = false;
  }
};
</script>
