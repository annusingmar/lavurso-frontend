<template>
  <div class="row flex-center" style="min-height: 75vh">
    <div class="col-md-8 col-xs-10" style="min-width: 0px">
      <q-table
        title="Sessions"
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
                label="Remove All"
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
              @click="removeUserSessionPrompt(actionProps.row.id)"
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
import { ref } from "vue";

const $q = useQuasar();
const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
});

const sessions = ref([]);
const loading = ref(true);

const columns = [
  {
    name: "expires",
    required: true,
    label: "Expires",
    align: "left",
    field: (row) => row.expires,
    format: (val) => formatDate(val),
    sortable: true,
  },
  {
    name: "login_ip",
    required: true,
    label: "Login IP",
    align: "left",
    field: (row) => row.login_ip,
    sortable: true,
  },
  {
    name: "login_browser",
    required: true,
    label: "Login Browser",
    align: "left",
    field: (row) => row.login_browser,
    sortable: true,
  },
  {
    name: "logged_in",
    required: true,
    label: "Logged In",
    align: "left",
    field: (row) => row.logged_in,
    format: (val) => formatDate(val),
    sortable: true,
  },
  {
    name: "last_seen",
    required: true,
    label: "Last Seen",
    align: "left",
    field: (row) => row.last_seen,
    format: (val) => formatDate(val),
    sortable: true,
  },
  { name: "actions", label: "Action" },
];

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
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};

const removeUserSession = async (id) => {
  try {
    await api.delete("/sessions/" + id);
    $q.notify({
      type: "positive",
      position: "top",
      message: "Deleting session succeeded!",
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
      message: "Deleting session failed",
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
      message: "Deleting sessions succeeded!",
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
      message: "Deleting sessions failed",
      timeout: 6000,
    });
  }
};

const removeUserSessionPrompt = (id) => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this session?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    removeUserSession(id);
  });
};

const removeAllSessionsPrompt = () => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete ALL sessions for this user?",
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
