<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: 90vh">
      <div class="col-xl-8 col-sm-10" style="min-width: 0px">
        <q-table
          title="Groups"
          :rows="groups"
          :columns="columns"
          :loading="loading"
          :pagination="{ rowsPerPage: 10 }"
          row-key="id"
        >
          <template v-slot:top-right>
            <div class="row items-end">
              <q-btn color="primary" label="new group" @click="newGroupDialog">
              </q-btn>
            </div>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                icon="mode_edit"
                @click="editGroup(props.row.id)"
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
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "GroupsPage",
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const columns = [
      {
        name: "name",
        required: true,
        label: "Name",
        align: "left",
        field: (row) => row.name,
        sortable: false,
      },
      {
        name: "members",
        required: true,
        label: "Members",
        align: "left",
        field: (row) => row.member_count + " members",
        sortable: true,
      },
      { name: "actions", label: "Action" },
    ];

    const loading = ref(true);
    const groups = ref([]);
    const getGroups = async () => {
      loading.value = true;
      try {
        const response = await api.get("/groups");
        groups.value =
          response.data.groups !== null ? response.data.groups : [];
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

    const newGroup = async (val) => {
      try {
        await api.post("/groups", {
          name: val,
        });
        $q.notify({
          type: "positive",
          position: "top",
          message: "Group created successfully",
          timeout: 3000,
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Group creation failed",
          timeout: 6000,
        });
      } finally {
        await getGroups();
      }
    };

    const newGroupDialog = () => {
      $q.dialog({
        title: "New group",
        prompt: {
          model: "",
          type: "text",
          isValid: (val) => val && val.length > 0,
        },
        cancel: true,
      }).onOk((data) => {
        newGroup(data);
      });
    };

    const editGroup = (id) => router.push("/admin/groups/" + id);

    getGroups();

    return {
      columns,
      groups,
      loading,
      newGroupDialog,
      editGroup,
    };
  },
};
</script>
