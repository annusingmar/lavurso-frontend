<template>
  <q-card>
    <div class="row justify-start items-start">
      <div class="col-shrink">
        <q-card-section>
          <div class="text-subtitle2">{{ msg.user.name }}</div>
          <div class="text-caption">{{ createdAt }}</div>
          <div v-if="hasBeenEdited" class="text-caption">
            {{ t("messages.edited") }} {{ updatedAt }}
          </div>
          <div v-if="msg.user.id === id" class="row q-col-gutter-x-md">
            <div
              v-if="msg.type !== 'thread_start'"
              class="col-sm-6 col-xs-12 q-mt-sm"
            >
              <q-btn
                color="negative"
                :label="t('messages.delete')"
                size="sm"
                :loading="deleteMessageLoading"
                @click="deleteMessagePrompt"
              ></q-btn>
            </div>
            <div class="col-sm-6 col-xs-12 q-mt-sm">
              <q-btn
                color="secondary"
                :label="t('messages.edit')"
                size="sm"
                @click="toggleMessageEditor"
              ></q-btn>
            </div>
          </div>
        </q-card-section>
      </div>
      <div class="col-grow">
        <q-card-section v-if="!messageEditorVisible">
          <div v-html="msg.body"></div>
        </q-card-section>
        <q-card-section v-else>
          <q-editor
            ref="editorRef"
            v-model="editorMessage"
            :toolbar="[
              ['bold', 'italic', 'strike', 'underline'],
              ['undo', 'redo'],
            ]"
            min-height="5rem"
            @paste="onPaste"
          ></q-editor>
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
import { storeToRefs } from "pinia";
import { api } from "src/boot/axios";
import { onEditorPaste } from "src/composables/editor";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const { id } = storeToRefs(useUserStore());
const props = defineProps({
  msg: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["refreshThread"]);

const createdAt = computed(() => {
  return date.formatDate(props.msg.created_at, "DD. MMM YYYY HH:mm");
});

const updatedAt = computed(() => {
  return date.formatDate(props.msg.updated_at, "DD. MMM YYYY HH:mm");
});

const hasBeenEdited = computed(() =>
  date.getDateDiff(
    new Date(props.msg.updated_at),
    new Date(props.msg.created_at),
    "seconds"
  )
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
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("messages.deletingMessageFailed"),
      timeout: 6000,
    });
  } finally {
    deleteMessageLoading.value = false;
    emit("refreshThread");
  }
};

const deleteMessagePrompt = (id) => {
  $q.dialog({
    title: "Confirm",
    message: t("messages.deleteMessageConfirm"),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteMessage();
  });
};

// editing message

const onPaste = (event) => {
  onEditorPaste(event, editorRef);
};

const messageEditorVisible = ref(false);
const editorMessage = ref("");
const editorRef = ref(null);
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
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("messages.savingMessageFailed"),
      timeout: 6000,
    });
  } finally {
    saveLoading.value = false;
    emit("refreshThread");
  }
};
</script>
