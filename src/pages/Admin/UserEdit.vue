<template>
  <q-page>
    <q-tabs v-model="tab" active-color="primary" indicator-color="primary">
      <q-tab name="general" :label="t('general')"></q-tab>
      <q-tab name="sessions" :label="t('user.session.sessions')"></q-tab>
      <q-tab
        v-if="user.user.role === 'student'"
        name="parents"
        :label="t('roles.parents')"
      ></q-tab>
      <q-route-tab
        v-if="user.user.role === 'student'"
        :label="t('user.student.teacherPage')"
        :to="'/teacher/students/' + user.user.id"
      ></q-route-tab>
    </q-tabs>

    <q-separator />

    <q-tab-panels
      v-model="tab"
      animated
      keep-alive
      class="row"
      style="min-height: 89vh; align-items: center"
    >
      <q-tab-panel name="general">
        <UserEditGeneral
          :server-user="user"
          @refresh-user="getUserFromAPI"
        ></UserEditGeneral>
      </q-tab-panel>
      <q-tab-panel name="sessions">
        <UserEditSessions :id="user.user.id"></UserEditSessions>
      </q-tab-panel>
      <q-tab-panel v-if="user.user.role === 'student'" name="parents">
        <UserEditParents :id="user.user.id"></UserEditParents>
      </q-tab-panel>
    </q-tab-panels>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { ref, reactive } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import UserEditGeneral from "./UserEditGeneral.vue";
import UserEditParents from "./UserEditParents.vue";
import UserEditSessions from "./UserEditSessions.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

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
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};
getUserFromAPI();
</script>
