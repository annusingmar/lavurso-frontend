<template>
  <div class="row flex-center" style="height: 90vh">
    <div class="col-10">
      <q-card>
        <q-card-section>
          <div class="text-h4">Members</div>
        </q-card-section>
        <MessageMembersList
          :userID="userID"
          :users="users"
          :thread="thread"
          :groups="groups"
          :loading="loading"
          @refresh-members="getMembers"
        ></MessageMembersList>
      </q-card>
    </div>
  </div>
</template>

<script>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { reactive, ref } from "vue";
import MessageMembersList from "src/components/MessageMembersList.vue";

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
        users.value = response.data.users !== null ? response.data.users : [];
        groups.value =
          response.data.groups !== null ? response.data.groups : [];
        thread.content = response.data.thread;
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
    getMembers();
    return {
      users,
      groups,
      thread,
      loading,
      userID: userStore.id,
      getMembers,
    };
  },
  components: { MessageMembersList },
};
</script>
