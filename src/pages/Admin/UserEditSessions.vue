<template>
  <div class="row flex-center" style="min-height: 75vh">
    <div class="col-md-10 col-xs-10" style="min-width: 0px">
      <q-table
        :title="t('user.session.sessions')"
        :rows="sessions"
        :columns="columns"
        row-key="id"
        :loading="loading"
      >
        <template #top-right>
          <div class="row items-end justify-between">
            <div class="col-auto">
              <q-btn
                color="negative"
                :label="t('user.session.cancelAllSessions')"
                @click="removeAllSessionsPrompt"
              >
              </q-btn>
            </div>
          </div>
        </template>

        <template #body-cell-actions="actionProps">
          <q-td :props="actionProps">
            <q-btn
              flat
              icon="clear"
              :disable="new Date(actionProps.row.expires) < new Date()"
              @click="removeUserSession(actionProps.row.id)"
            ></q-btn>
          </q-td>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script setup>
import { date, useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const sessions = ref([]);
const loading = ref(true);

const expiredStyle = (row) =>
  new Date(row.expires) < new Date()
    ? { background: "rgba(255, 0, 0, 0.100)" }
    : "";

const columns = computed(() => [
  {
    name: "expires",
    required: true,
    label: t("user.session.expires"),
    align: "left",
    field: (row) => row.expires,
    format: (val) => formatDate(val),
    sortable: true,
    style: expiredStyle,
  },
  {
    name: "login_ip",
    required: true,
    label: t("user.session.loginIP"),
    align: "left",
    field: (row) => row.login_ip,
    sortable: true,
  },
  {
    name: "login_browser",
    required: true,
    label: t("user.session.loginBrowser"),
    align: "left",
    field: (row) => row.login_browser,
    sortable: true,
  },
  {
    name: "logged_in",
    required: true,
    label: t("user.session.loggedIn"),
    align: "left",
    field: (row) => row.logged_in,
    format: (val) => formatDate(val),
    sortable: true,
  },
  {
    name: "last_seen",
    required: true,
    label: t("user.session.lastSeen"),
    align: "left",
    field: (row) => row.last_seen,
    format: (val) => formatDate(val),
    sortable: true,
  },
  { name: "actions", label: t("action") },
]);

const getUserSessions = async () => {
  loading.value = true;
  try {
    const response = await api.get("/users/" + props.id + "/sessions");
    response.data.sessions !== null
      ? (sessions.value = response.data.sessions)
      : (sessions.value = []);
    loading.value = false;
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("dataLoadingFail"),
      timeout: 0,
      actions: [{ label: t("dismiss"), color: "white" }],
    });
  }
};

const removeUserSession = async (id) => {
  try {
    await api.delete("/sessions/" + id);
    $q.notify({
      type: "positive",
      position: "top",
      message: t("user.session.cancellingSessionSucceeded"),
      timeout: 3000,
    });
    getUserSessions();
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("user.session.cancellingSessionFailed"),
      timeout: 6000,
    });
  }
};

const removeAllSessions = async () => {
  try {
    await api.delete("/users/" + props.id + "/sessions");
    $q.notify({
      type: "positive",
      position: "top",
      message: t("user.session.cancellingSessionSucceeded"),
      timeout: 3000,
    });
    getUserSessions();
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("user.session.cancellingSessionFailed"),
      timeout: 6000,
    });
  }
};

const removeAllSessionsPrompt = () => {
  $q.dialog({
    title: t("confirm"),
    message: t("user.session.cancellingAllSessionsConfirm"),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    removeAllSessions();
  });
};

const formatDate = (val) => {
  return date.formatDate(new Date(val), "DD. MMMM YYYY HH:mm:ss", $q.lang.date);
};

getUserSessions();
</script>
