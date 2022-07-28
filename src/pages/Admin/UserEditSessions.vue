<template>
  <q-page>
    <div class="row q-mx-xl q-my-xl flex-center" style="height: 75vh">
      <div class="col-xl-8 col-md-8 col-sm-12 col-xs-12">
        <q-table
          title="Sessions"
          :rows="sessions"
          :columns="columns"
          row-key="id"
          :loading="loading"
        >
          <template v-slot:top-right>
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

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                icon="clear"
                @click="removeUserSessionPrompt(props.row.id)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { reactive, ref } from "vue";

export default {
  props: ["id"],
  name: "UserEditSessions",
  setup(props) {
    const $q = useQuasar();

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
        $q.notify({
          type: "negative",
          position: "top",
          message: "Loading of data failed",
          timeout: 0,
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
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Deleting session failed",
          timeout: 6000,
        });
      } finally {
        await getUserSessions();
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
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Deleting sessions failed",
          timeout: 6000,
        });
      } finally {
        await getUserSessions();
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

    const formatDate = (date) => {
      return new Date(date).toLocaleString("et");
    };

    getUserSessions();

    return {
      sessions,
      loading,
      columns,
      removeUserSessionPrompt,
      removeAllSessionsPrompt,
    };
  },
};
</script>
