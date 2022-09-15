<template>
  <q-card>
    <q-card-section>
      <div class="text-h4">{{ t("group.groupMembers") }}</div>
    </q-card-section>
    <q-card-section>
      <q-table
        v-model:selected="selectedUsers"
        :rows="users"
        :columns="columns"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        row-key="id"
        :selection="group.content.archived ? 'none' : 'multiple'"
      >
      </q-table>
      <div v-if="!group.content.archived" class="row justify-end q-mt-md">
        <q-btn
          color="negative"
          :label="t('removeSelected')"
          :loading="removeLoading"
          :disable="selectedUsers.length === 0"
          @click="removeUsers"
        ></q-btn>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  users: {
    type: Array,
    required: true,
  },
  group: {
    type: Object,
    required: true,
  },
  loading: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["refreshGroup"]);

const columns = [
  {
    name: "name",
    required: true,
    label: t("name"),
    align: "left",
    field: (row) => row.name,
    sortable: false,
  },
  {
    name: "role",
    required: true,
    label: t("role"),
    align: "left",
    field: (row) => row.role,
    format: (val) => t(`roles.${val}`),
    sortable: true,
  },
];

const selectedUsers = ref([]);

const removeLoading = ref(false);
const removeUsers = async () => {
  removeLoading.value = true;
  const userIDs = [];
  selectedUsers.value.forEach((u) => userIDs.push(u.id));
  try {
    await api.delete("/groups/" + props.group.content.id + "/users", {
      data: {
        user_ids: userIDs,
      },
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: t("messages.removingMembersSucceeded"),
      timeout: 3000,
    });
    selectedUsers.value = [];
    emit("refreshGroup");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("messages.removingMembersFailed"),
      timeout: 6000,
    });
  } finally {
    removeLoading.value = false;
  }
};
</script>
