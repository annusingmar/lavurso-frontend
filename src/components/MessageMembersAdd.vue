<template>
  <q-card>
    <q-card-section>
      <div class="text-h4">{{ t("messages.addMembers") }}</div>
    </q-card-section>
    <q-card-section>
      <div class="row q-col-gutter-x-md">
        <div class="col-sm col-xs-12">
          <q-select
            v-model="addedUsers"
            filled
            multiple
            use-chips
            use-input
            input-debounce="200"
            stack-label
            :label="t('users')"
            :options="availableUsers"
            option-label="name"
            option-value="id"
            :hint="t('minimumNCharacters', ['4'])"
            @filter="usersFilter"
          >
            <template #option="scope">
              <q-item v-bind="scope.itemProps">
                <q-item-section>
                  <q-item-label>{{ scope.opt.name }}</q-item-label>
                  <q-item-label v-if="scope.opt.role !== 'student'" caption>{{
                    t(`roles.${scope.opt.role}`)
                  }}</q-item-label>
                  <q-item-label v-else caption
                    >{{ t(`roles.${scope.opt.role}`)
                    }}{{
                      scope.opt.student.class.display_name
                        ? ` - ${scope.opt.student.class.display_name}`
                        : ""
                    }}</q-item-label
                  >
                </q-item-section>
              </q-item>
            </template>
          </q-select>
        </div>
        <div class="col-sm col-xs-12">
          <q-select
            v-model="addedGroups"
            filled
            multiple
            use-chips
            use-input
            input-debounce="200"
            stack-label
            :label="t('groups')"
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
          :label="t('messages.addMembers')"
          :loading="addLoading"
          :disabled="!atLeastOneAdded"
          @click="addMembers"
        ></q-btn>
      </q-card-section>
    </div>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  userId: {
    type: Number,
    required: true,
  },
  users: {
    type: Array,
    required: true,
  },
  thread: {
    type: Object,
    required: true,
  },
  groups: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["refreshMembers"]);

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

const availableGroups = ref(null);
const getGroups = async () => {
  try {
    const response = await api.get("/users/" + props.userId + "/groups");
    availableGroups.value =
      response.data.groups !== null
        ? response.data.groups.filter(
            (g) => !props.groups.some((tgroup) => tgroup.id === g.id)
          )
        : [];
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
      message: t("messages.addingMembersSucceeded"),
      timeout: 3000,
    });
  } catch {
    $q.notify({
      type: "negative",
      position: "top",
      message: t("messages.addingMembersFailed"),
      timeout: 6000,
    });
  } finally {
    addedUsers.value = [];
    addedGroups.value = [];
    availableUsers.value = null;
    addLoading.value = false;
    emit("refreshMembers");
  }
};

watch(props, () => {
  availableGroups.value = null;
  filteredGroups.value = null;
});
</script>
