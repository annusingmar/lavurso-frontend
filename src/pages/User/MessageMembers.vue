<template>
  <div
    class="row flex-center q-col-gutter-md"
    style="height: 90vh; align-content: center"
  >
    <div class="col-10">
      <MessageMembersList
        :userID="userID"
        :users="users"
        :thread="thread"
        :groups="groups"
        :loading="loading"
        @refresh-members="getMembers"
      ></MessageMembersList>
    </div>
    <div class="col-10" v-if="isUserThreadCreator">
      <MessageMembersAdd
        :userID="userID"
        :users="users"
        :thread="thread"
        :groups="groups"
        @refresh-members="getMembers"
      ></MessageMembersAdd>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { computed, reactive, ref } from "vue";
import MessageMembersList from "src/components/MessageMembersList.vue";
import MessageMembersAdd from "../../components/MessageMembersAdd.vue";

export default {
  name: "MessageMembers",
  props: ["id"],
  setup(props) {
    const $q = useQuasar();
    const userStore = storeToRefs(useUserStore());

    const users = ref([]);
    const groups = ref([]);
    const thread = reactive({ content: {} });
    const loading = ref(true);
    const getMembers = async () => {
      $q.loading.show();
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
        groups.value =
          response.data.groups !== null ? response.data.groups : [];
        $q.loading.hide();
        loading.value = false;
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Loading of data failed",
          timeout: 0,
        });
      }
    };

    const isUserThreadCreator = computed(
      () => thread.content.user && thread.content.user.id === userStore.id.value
    );

    getMembers();

    return {
      users,
      groups,
      thread,
      loading,
      userID: userStore.id,
      isUserThreadCreator,
      getMembers,
    };
  },
  components: { MessageMembersList, MessageMembersAdd },
};
</script>
