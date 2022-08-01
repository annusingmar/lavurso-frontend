<template>
  <q-page>
    <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
      <q-tab name="general" label="General"></q-tab>
      <q-tab name="sessions" label="Sessions"></q-tab>
      <q-tab
        name="parents"
        label="Parents"
        v-if="user.user.role === 'student'"
      ></q-tab>
      <q-tab
        name="class"
        label="Class"
        v-if="user.user.role === 'student'"
      ></q-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated keep-alive>
      <q-tab-panel name="general">
        <UserEditGeneral
          :server-user="user"
          @refresh-user="getUserFromAPI"
        ></UserEditGeneral>
      </q-tab-panel>
      <q-tab-panel name="sessions">
        <UserEditSessions :id="user.user.id"></UserEditSessions>
      </q-tab-panel>
      <q-tab-panel name="parents" v-if="user.user.role === 'student'">
        <UserEditParents :id="user.user.id"></UserEditParents>
      </q-tab-panel>
      <q-tab-panel name="class" v-if="user.user.role === 'student'">
        <UserEditClass :id="user.user.id"></UserEditClass>
      </q-tab-panel>
    </q-tab-panels>

    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script>
import { ref, reactive } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

import UserEditGeneral from "./UserEditGeneral.vue";
import UserEditParents from "./UserEditParents.vue";
import UserEditSessions from "./UserEditSessions.vue";
import UserEditClass from "./UserEditClass.vue";

export default {
  name: "UserEdit",
  props: ["id"],
  components: {
    UserEditGeneral,
    UserEditParents,
    UserEditSessions,
    UserEditClass,
  },
  setup(props) {
    const $q = useQuasar();
    const router = useRouter();
    const tab = ref("general");
    const user = reactive({ user: {} });
    const loading = ref(true);

    const getUserFromAPI = async () => {
      loading.value = true;
      try {
        const response = await api.get("/users/" + props.id);
        user.user = response.data.user;
        loading.value = false;
      } catch (error) {
        if (error.response && error.response.status == 404) {
          router.replace("/notFound");
        } else {
          $q.notify({
            type: "negative",
            position: "top",
            message: "Loading data failed",
            timeout: 0,
            actions: [{ label: "Dismiss", color: "white" }],
          });
        }
      }
    };
    getUserFromAPI();

    return { tab, user, loading, getUserFromAPI };
  },
};
</script>
