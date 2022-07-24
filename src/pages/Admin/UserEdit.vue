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

export default {
  props: ["id"],
  components: { UserEditGeneral, UserEditParents, UserEditSessions },
  setup(props) {
    const $q = useQuasar();
    const router = useRouter();
    const tab = ref("general");
    const user = reactive({ user: {} });
    const loading = ref(true);

    const getUserFromAPI = () => {
      loading.value = true;
      api
        .get("/users/" + props.id)
        .then((response) => {
          user.user = response.data.user;
          loading.value = false;
        })
        .catch((error) => {
          if (error.response && error.response.status == 404) {
            router.replace("/notFound");
          } else {
            $q.notify({
              color: "negative",
              position: "top",
              message: "Loading of data failed",
              icon: "report_problem",
              timeout: 0,
            });
          }
        });
    };
    getUserFromAPI();

    return { tab, user, loading, getUserFromAPI };
  },
};
</script>
