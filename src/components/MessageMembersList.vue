<template>
  <q-card>
    <q-card-section>
      <div class="text-h4">{{ t("messages.members") }}</div>
    </q-card-section>
    <div class="row">
      <div class="col-sm col-xs-12">
        <q-card-section>
          <div class="text-h6">{{ t("users") }}</div>
          <q-list v-if="users.length > 0" bordered separator>
            <q-item v-for="user in users" :key="user.id">
              <q-item-section>{{ user.name }}</q-item-section>
              <q-item-section v-if="isUserThreadCreator" side>
                <q-checkbox
                  v-model="removedUserIDs"
                  :val="user.id"
                  :disable="user.id === userId"
                  color="red"
                ></q-checkbox>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else-if="!loading">{{ t("messages.noUsersInThread") }}</div>
          <div
            v-if="isUserThreadCreator && removedUserIDs.length > 0"
            class="row justify-end q-mt-sm"
          >
            <div>{{ t("nSelected", [removedUserIDs.length]) }}</div>
          </div>
        </q-card-section>
      </div>
      <div class="col-sm col-xs-12">
        <q-card-section>
          <div class="text-h6">{{ t("groups") }}</div>
          <q-list v-if="groups.length > 0" bordered separator>
            <q-item v-for="group in groups" :key="group.id">
              <q-item-section>{{ group.name }}</q-item-section>
              <q-item-section v-if="isUserThreadCreator" side>
                <q-checkbox
                  v-model="removedGroupIDs"
                  :val="group.id"
                  color="red"
                ></q-checkbox>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else-if="!loading">{{ t("messages.noGroupsInThread") }}</div>
          <div
            v-if="isUserThreadCreator && removedGroupIDs.length > 0"
            class="row justify-end q-mt-sm"
          >
            <div>{{ t("nSelected", [removedGroupIDs.length]) }}</div>
          </div>
        </q-card-section>
      </div>
    </div>
    <div v-if="isUserThreadCreator" class="row justify-end">
      <q-card-section>
        <q-btn
          color="negative"
          :label="t('removeSelected')"
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
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
  groups: {
    type: Array,
    required: true,
  },
  thread: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["refreshMembers"]);

const isUserThreadCreator = computed(() => {
  return props.thread.content.user
    ? props.thread.content.user.id === props.userId
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
      message: t("messages.removingMembersSucceeded"),
      timeout: 3000,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("messages.removingMembersFailed"),
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
    message: t("messages.removeMembersConfirm"),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    removeMembers();
  });
};
</script>
