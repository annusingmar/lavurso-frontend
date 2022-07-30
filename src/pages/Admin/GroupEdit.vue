<template>
  <div class="row flex-center" style="height: 90vh; align-content: center">
    <div class="col-10">
      <GroupEditInfo :group="group" @refresh-group="getGroup"></GroupEditInfo>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, reactive } from "vue";
import GroupEditInfo from "../../components/GroupEditInfo.vue";

export default {
  name: "GroupEdit",
  props: ["id"],
  setup(props) {
    const $q = useQuasar();
    const loading = ref(true);
    const users = ref([]);
    const group = reactive({ content: {} });
    const getGroup = async () => {
      loading.value = true;
      $q.loading.show();
      try {
        const response = await api.get("/groups/" + props.id + "/users");
        group.content = response.data.group;
        users.value = response.data.users !== null ? response.data.users : [];
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
    getGroup();
    return {
      loading,
      users,
      group,
      getGroup,
    };
  },
  components: { GroupEditInfo },
};
</script>
