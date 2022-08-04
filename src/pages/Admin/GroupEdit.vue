<template>
  <q-page>
    <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
      <q-tab name="general" label="General"></q-tab>
      <q-tab name="members" label="Members"></q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated keep-alive>
      <q-tab-panel name="general">
        <GroupEditInfo :group="group" @refresh-group="getGroup"></GroupEditInfo>
      </q-tab-panel>
      <q-tab-panel name="members">
        <GroupEditMembers
          :group="group"
          :users="users"
          :loading="loading"
          @refresh-group="getGroup"
        ></GroupEditMembers>
      </q-tab-panel>
    </q-tab-panels>

    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, reactive } from "vue";
import GroupEditInfo from "./GroupEditInfo.vue";
import GroupEditMembers from "./GroupEditMembers.vue";

const $q = useQuasar();
const props = defineProps(["id"]);

const tab = ref("general");

const loading = ref(true);
const users = ref([]);
const group = reactive({ content: {} });
const getGroup = async () => {
  loading.value = true;
  try {
    const response = await api.get("/groups/" + props.id + "/users");
    group.content = response.data.group;
    users.value = response.data.users !== null ? response.data.users : [];
    loading.value = false;
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};
getGroup();
</script>
