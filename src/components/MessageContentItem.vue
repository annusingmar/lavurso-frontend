<template>
  <q-card>
    <div class="row justify-start items-start">
      <div class="col-shrink">
        <q-card-section>
          <div class="text-subtitle2">{{ msg.user.name }}</div>
          <div class="text-caption">{{ createdAt }}</div>
          <div class="text-caption" v-if="hasBeenEdited">
            Edited {{ updatedAt }}
          </div>
          <div class="row q-col-gutter-x-sm" v-if="msg.user.id === id">
            <div class="col-sm-6 col-xs-12" v-if="msg.type !== 'thread_start'">
              <q-btn
                color="negative"
                label="Delete"
                class="q-mt-sm"
                size="sm"
                :loading="deleteMessageLoading"
                @click="deleteMessagePrompt"
              ></q-btn>
            </div>
            <div class="col-sm-6 col-xs-12">
              <q-btn
                color="secondary"
                label="edit"
                class="q-mt-sm"
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
            @paste="onPaste"
            v-model="editorMessage"
            :toolbar="[
              ['bold', 'italic', 'strike', 'underline'],
              ['undo', 'redo'],
            ]"
            min-height="5rem"
          ></q-editor>
          <div class="row justify-end q-mt-sm">
            <q-btn
              color="primary"
              :loading="saveLoading"
              :disabled="saveButtonDisable"
              icon-right="save"
              label="save"
              @click="updateMessage"
            >
            </q-btn>
          </div>
        </q-card-section>
      </div>
    </div>
  </q-card>
</template>

<script>
import { useQuasar, date } from "quasar";
import { computed, ref } from "vue";
import { useUserStore } from "src/stores/user";
import { storeToRefs } from "pinia";
import { api } from "src/boot/axios";
import { onEditorPaste } from "src/composables/editor";

export default {
  name: "MessageContentItem",
  props: ["msg"],
  emits: ["refreshThread"],
  setup(props, context) {
    const $q = useQuasar();
    const { id } = storeToRefs(useUserStore());
    const deleteMessageLoading = ref(false);

    const createdAt = computed(() => {
      return date.formatDate(props.msg.created_at, "DD. MMM YYYY HH:mm");
    });

    const updatedAt = computed(() => {
      return date.formatDate(props.msg.updated_at, "DD. MMM YYYY HH:mm");
    });

    const hasBeenEdited = computed(() => {
      return (
        new Date(props.msg.updated_at).getTime() !==
        new Date(props.msg.created_at).getTime()
      );
    });

    // deleting message

    const deleteMessage = async () => {
      deleteMessageLoading.value = true;
      try {
        await api.delete("/messages/" + props.msg.id);
        $q.notify({
          type: "positive",
          position: "top",
          message: "Deleting message succeeded!",
          timeout: 3000,
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Deleting message failed",
          timeout: 6000,
        });
      } finally {
        deleteMessageLoading.value = false;
        context.emit("refreshThread");
      }
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
          message: "Saving message succeeded!",
          timeout: 3000,
        });
        messageEditorVisible.value = false;
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Saving message failed",
          timeout: 6000,
        });
      } finally {
        saveLoading.value = false;
        context.emit("refreshThread");
      }
    };

    return {
      createdAt,
      updatedAt,
      id,
      deleteMessageLoading,
      messageEditorVisible,
      editorMessage,
      editorRef,
      saveLoading,
      saveButtonDisable,
      hasBeenEdited,
      updateMessage,
      deleteMessagePrompt,
      toggleMessageEditor,
      onPaste,
    };
  },
};
</script>
