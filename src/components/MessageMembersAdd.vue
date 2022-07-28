<template>
  <q-card>
    <q-card-section>
      <div class="text-h4">Add members</div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-x-md">
        <div class="col-sm col-xs-12">
          <q-select
            filled
            multiple
            use-chips
            use-input
            input-debounce="200"
            stack-label
            label="Users"
            v-model="addedUsers"
            :options="availableUsers"
            option-label="name"
            option-value="id"
            hint="Minimum 4 characters"
            @filter="usersFilter"
          ></q-select>
        </div>
        <div class="col-sm col-xs-12">
          <q-select
            filled
            multiple
            use-chips
            use-input
            input-debounce="200"
            stack-label
            label="Groups"
            v-model="addedGroups"
            :options="filteredGroups"
            option-label="name"
            option-value="id"
            @filter="groupsFilter"
          ></q-select>
        </div>
      </div>
    </q-card-section>
    <div class="row justify-end">
      <q-card-section>
        <q-btn
          color="primary"
          label="add members"
          :loading="addLoading"
          :disabled="!atLeastOneAdded"
          @click="addMembers"
        ></q-btn>
      </q-card-section>
    </div>
  </q-card>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, computed } from "vue";

export default {
  name: "MessageMembersAdd",
  props: ["userID", "users", "thread", "groups"],
  emits: ["refreshMembers"],
  setup(props, context) {
    const $q = useQuasar();

    const usersFilter = async (val, update, abort) => {
      if (val.length < 4) {
        abort();
        return;
      }
      await getUsers(val);
      update();
    };

    const filteredGroups = ref(null);
    const groupsFilter = async (val, update) => {
      if (availableGroups.value !== null) {
        update(() => {
          const v = val.toLowerCase();
          filteredGroups.value = availableGroups.value.filter(
            (g) => g.name.toLowerCase().indexOf(v) > -1
          );
        });
      } else {
        await getGroups();
        update(() => {
          filteredGroups.value = availableGroups.value;
        });
      }
    };

    const availableUsers = ref(null);
    const getUsers = async (search) => {
      try {
        const response = await api.get("/users/search", {
          params: {
            name: search,
          },
        });
        availableUsers.value =
          response.data.result !== null
            ? response.data.result.filter(
                (u) => !props.users.some((tuser) => tuser.id === u.id)
              )
            : [];
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Loading of data failed",
          timeout: 0,
        });
      }
    };

    const availableGroups = ref(null);
    const getGroups = async () => {
      try {
        const response = await api.get("/users/" + props.userID + "/groups");
        availableGroups.value =
          response.data.groups !== null
            ? response.data.groups.filter(
                (g) => !props.groups.some((tgroup) => tgroup.id === g.id)
              )
            : [];
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Loading of data failed",
          timeout: 0,
        });
      }
    };

    const atLeastOneAdded = computed(
      () => addedUsers.value.length > 0 || addedGroups.value.length > 0
    );

    const addedUsers = ref([]);
    const addedGroups = ref([]);
    const addLoading = ref(false);
    const addMembers = async () => {
      const userIDs = [];
      const groupIDs = [];
      addedUsers.value.forEach((u) => userIDs.push(u.id));
      addedGroups.value.forEach((g) => groupIDs.push(g.id));
      addLoading.value = true;
      try {
        await api.put("/threads/" + props.thread.content.id + "/members", {
          user_ids: userIDs,
          group_ids: groupIDs,
        });
        $q.notify({
          type: "positive",
          position: "top",
          message: "Adding members succeeded!",
          timeout: 3000,
        });
      } catch {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Adding members failed",
          timeout: 6000,
        });
      } finally {
        addedUsers.value = [];
        addedGroups.value = [];
        availableUsers.value = null;
        availableGroups.value = null;
        filteredGroups.value = null;
        addLoading.value = false;
        context.emit("refreshMembers");
      }
    };

    return {
      filteredGroups,
      availableUsers,
      addedUsers,
      addedGroups,
      addLoading,
      atLeastOneAdded,
      usersFilter,
      groupsFilter,
      addMembers,
    };
  },
};
</script>
