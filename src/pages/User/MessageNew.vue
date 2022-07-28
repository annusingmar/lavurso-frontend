<template>
  <div class="row flex-center" style="height: 90vh">
    <div class="col-10">
      <q-card>
        <q-card-section>
          <div class="text-h4">New Message</div>
        </q-card-section>
        <q-card-section>
          <q-input
            square
            outlined
            v-model="title"
            label="Title"
            ref="titleRef"
            :rules="[(val) => (val && val.length > 0) || 'Must not be empty']"
            lazy-rules="ondemand"
          ></q-input>
          <q-editor
            ref="editorRef"
            @paste="onPaste"
            v-model="message"
            :class="{ editorError }"
            class="q-mt-sm"
            :toolbar="[
              ['bold', 'italic', 'strike', 'underline'],
              ['undo', 'redo'],
            ]"
            min-height="10rem"
          ></q-editor>
          <div class="text-subtitle2 q-mt-sm" v-if="editorError">
            Message content cannot be empty
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row q-gutter-x-md">
            <div class="col-sm col-xs-12">
              <q-select
                filled
                multiple
                use-chips
                use-input
                input-debounce="200"
                stack-label
                label="Users"
                v-model="chosenUsers"
                :options="foundUsers"
                option-label="name"
                option-value="id"
                hint="Minimum 4 characters"
                @filter="usersFilter"
              ></q-select>
            </div>
            <div class="col-sm col-xs-12">
              <q-select
                filled
                multiple
                use-chips
                use-input
                input-debounce="200"
                stack-label
                label="Groups"
                v-model="chosenGroups"
                :options="filteredGroups"
                option-label="name"
                option-value="id"
                @filter="groupsFilter"
              ></q-select>
            </div>
          </div>
        </q-card-section>
        <q-card-section>
          <div class="row justify-end">
            <q-btn
              color="primary"
              label="Send"
              icon-right="send"
              :loading="sendLoading"
              @click="sendMessage"
              class="q-mt-md"
            ></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserStore } from "src/stores/user";
import { storeToRefs } from "pinia";

export default {
  name: "MessageNew",
  setup() {
    const $q = useQuasar();
    const router = useRouter();
    const { id } = storeToRefs(useUserStore());

    const usersFilter = async (val, update, abort) => {
      if (val.length < 4) {
        abort();
        return;
      }
      await getUsersResult(val);
      update();
    };

    const filteredGroups = ref(null);
    const groupsFilter = async (val, update) => {
      if (userGroups.value !== null) {
        update(() => {
          const v = val.toLowerCase();
          filteredGroups.value = userGroups.value.filter(
            (g) => g.name.toLowerCase().indexOf(v) > -1
          );
        });
      } else {
        await getUserGroups();
        update(() => {
          filteredGroups.value = userGroups.value;
        });
      }
    };

    const foundUsers = ref(null);
    const getUsersResult = (search) => {
      api
        .get("/users/search", {
          params: {
            name: search,
          },
        })
        .then((response) => {
          foundUsers.value =
            response.data.result !== null
              ? response.data.result.filter((u) => u.id !== id.value)
              : [];
        })
        .catch((error) => {
          $q.notify({
            type: "negative",
            position: "top",
            message: "Loading of data failed",
            timeout: 0,
          });
        });
    };

    const userGroups = ref(null);
    const getUserGroups = () => {
      return api
        .get("/users/" + id.value + "/groups")
        .then((response) => {
          userGroups.value =
            response.data.groups !== null ? response.data.groups : [];
        })
        .catch((error) => {
          $q.notify({
            type: "negative",
            position: "top",
            message: "Loading of data failed",
            timeout: 0,
          });
        });
    };

    const onPaste = (event) => {
      if (event.target.nodeName === "INPUT") return;
      let text, onPasteStripFormattingIEPaste;
      event.preventDefault();
      event.stopPropagation();
      if (event.originalEvent && event.originalEvent.clipboardData.getData) {
        text = event.originalEvent.clipboardData.getData("text/plain");
        editorRef.value.runCmd("insertText", text);
      } else if (event.clipboardData && event.clipboardData.getData) {
        text = event.clipboardData.getData("text/plain");
        editorRef.value.runCmd("insertText", text);
      } else if (window.clipboardData && window.clipboardData.getData) {
        if (!onPasteStripFormattingIEPaste) {
          onPasteStripFormattingIEPaste = true;
          editorRef.value.runCmd("ms-pasteTextOnly", text);
        }
        onPasteStripFormattingIEPaste = false;
      }
    };

    const editorRef = ref(null);
    const titleRef = ref(null);
    const sendLoading = ref(false);
    const editorError = ref(false);

    const title = ref("");
    const message = ref("");
    const chosenUsers = ref([]);
    const chosenGroups = ref([]);

    const sendMessage = () => {
      editorError.value = false;
      if (!titleRef.value.validate()) {
        return;
      } else if (message.value.trim() === "") {
        editorError.value = true;
        return;
      }

      const userIDs = [];
      const groupIDs = [];
      chosenUsers.value.forEach((u) => userIDs.push(u.id));
      chosenGroups.value.forEach((g) => groupIDs.push(g.id));
      sendLoading.value = true;
      api
        .post("/threads", {
          title: title.value,
          body: message.value,
          user_ids: userIDs,
          group_ids: groupIDs,
        })
        .then((response) => {
          $q.notify({
            type: "positive",
            position: "top",
            message: "Sending message succeeded!",
            timeout: 3000,
          });
          router.replace("/messages/" + response.data.thread.id);
        })
        .catch((error) => {
          $q.notify({
            type: "negative",
            position: "top",
            message: "Sending message failed",
            timeout: 6000,
          });
        });
      sendLoading.value = false;
    };

    return {
      title,
      message,
      editorRef,
      titleRef,
      foundUsers,
      chosenUsers,
      editorError,
      sendLoading,
      chosenGroups,
      filteredGroups,
      groupsFilter,
      usersFilter,
      onPaste,
      sendMessage,
    };
  },
};
</script>

<style scoped>
.editorError {
  border: 2px solid;
  border-color: red;
  border-radius: 5px;
}
</style>
