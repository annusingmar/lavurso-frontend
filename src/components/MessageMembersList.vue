<template>
  <q-card>
    <q-card-section>
      <div class="text-h4">Members</div>
    </q-card-section>
    <div class="row">
      <div class="col-sm col-xs-12">
        <q-card-section>
          <div class="text-h6">Users</div>
          <q-list bordered separator v-if="users.length > 0">
            <q-item v-for="user in users" :key="user.id">
              <q-item-section>{{ user.name }}</q-item-section>
              <q-item-section side v-if="isUserThreadCreator">
                <q-checkbox
                  v-model="removedUserIDs"
                  :val="user.id"
                  :disable="user.id === userID"
                  color="red"
                ></q-checkbox>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else-if="!loading">No users in thread.</div>
          <div
            class="row justify-end q-mt-sm"
            v-if="isUserThreadCreator && removedUserIDs.length > 0"
          >
            <div>{{ removedUserIDs.length }} selected</div>
          </div>
        </q-card-section>
      </div>
      <div class="col-sm col-xs-12">
        <q-card-section>
          <div class="text-h6">Groups</div>
          <q-list bordered separator v-if="groups.length > 0">
            <q-item v-for="group in groups" :key="group.id">
              <q-item-section>{{ group.name }}</q-item-section>
              <q-item-section side v-if="isUserThreadCreator">
                <q-checkbox
                  v-model="removedGroupIDs"
                  :val="group.id"
                  color="red"
                ></q-checkbox>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else-if="!loading">No groups in thread.</div>
          <div
            class="row justify-end q-mt-sm"
            v-if="isUserThreadCreator && removedGroupIDs.length > 0"
          >
            <div>{{ removedGroupIDs.length }} selected</div>
          </div>
        </q-card-section>
      </div>
    </div>
    <div class="row justify-end" v-if="isUserThreadCreator">
      <q-card-section>
        <q-btn
          color="negative"
          label="remove selected"
          :loading="removeLoading"
          :disabled="!atLeastOneRemoved"
          @click="removeMembersPrompt"
        ></q-btn>
      </q-card-section>
    </div>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, computed } from "vue";

const $q = useQuasar();
const props = defineProps(["userID", "users", "groups", "thread", "loading"]);
const emit = defineEmits(["refreshMembers"]);

const isUserThreadCreator = computed(() => {
  return props.thread.content.user
    ? props.thread.content.user.id === props.userID
    : false;
});

const atLeastOneRemoved = computed(
  () => removedUserIDs.value.length > 0 || removedGroupIDs.value.length > 0
);

const removedUserIDs = ref([]);
const removedGroupIDs = ref([]);
const removeLoading = ref(false);
const removeMembers = async () => {
  removeLoading.value = true;
  try {
    await api.delete("/threads/" + props.thread.content.id + "/members", {
      data: {
        user_ids: removedUserIDs.value,
        group_ids: removedGroupIDs.value,
      },
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: "Removing members succeeded!",
      timeout: 3000,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Removing members failed",
      timeout: 6000,
    });
  } finally {
    removedUserIDs.value = [];
    removedGroupIDs.value = [];
    removeLoading.value = false;
    emit("refreshMembers");
  }
};

const removeMembersPrompt = (id) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to these members?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    removeMembers();
  });
};
</script>
