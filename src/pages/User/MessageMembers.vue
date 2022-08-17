<template>
  <q-page>
    <div
      class="row flex-center q-col-gutter-md q-py-lg"
      style="min-height: inherit; align-content: center"
    >
      <div class="col-10">
        <MessageMembersList
          :user-id="userID"
          :users="users"
          :thread="thread"
          :groups="groups"
          :loading="loading"
          @refresh-members="getMembers"
        ></MessageMembersList>
      </div>
      <div v-if="isUserThreadCreator" class="col-10">
        <MessageMembersAdd
          :user-id="userID"
          :users="users"
          :thread="thread"
          :groups="groups"
          @refresh-members="getMembers"
        ></MessageMembersAdd>
      </div>
    </div>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { computed, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import MessageMembersAdd from "../../components/MessageMembersAdd.vue";
import MessageMembersList from "src/components/MessageMembersList.vue";

const $q = useQuasar();
const router = useRouter();
const userStore = storeToRefs(useUserStore());
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});
const userID = userStore.id;

const users = ref([]);
const groups = ref([]);
const thread = reactive({ content: {} });
const loading = ref(true);
const getMembers = async () => {
  loading.value = true;
  try {
    const response = await api.get("/threads/" + props.id + "/members");
    thread.content = response.data.thread;

    // if the users array in response is not null
    // sort the array so that thread creator is first
    // otherwise return empty array
    users.value =
      response.data.users !== null
        ? response.data.users.sort((u1, u2) =>
            u1.id === thread.content.user.id
              ? -1
              : u2.id === thread.content.user.id
              ? 1
              : 0
          )
        : [];
    groups.value = response.data.groups !== null ? response.data.groups : [];
    loading.value = false;
  } catch (error) {
    if (error.response && error.response.status == 404) {
      router.replace("/not-found");
    } else if (error.response && error.response.status == 403) {
      router.replace("/access-denied");
    } else {
      $q.notify({
        type: "negative",
        position: "top",
        message: "Loading of data failed",
        timeout: 0,
        actions: [{ label: "Dismiss", color: "white" }],
      });
    }
  }
};

const isUserThreadCreator = computed(
  () => thread.content.user && thread.content.user.id === userStore.id.value
);

getMembers();
</script>
