<template>
  <div class="row flex-center" style="min-height: 75vh">
    <div class="col-md-6 col-xs-10">
      <q-card>
        <q-card-section>
          <div class="row justify-between items-center">
            <div class="text-h4">{{ t("group.editGroup") }}</div>
            <q-btn
              :loading="deleteLoading"
              color="negative"
              :label="t('delete')"
              @click="deleteGroupPrompt"
            ></q-btn>
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            ref="nameField"
            v-model.trim="inputGroupName"
            filled
            :label="t('name')"
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
            :rules="[(val) => (val && val.length > 0) || t('mandatoryField')]"
          ></q-input>
          <q-checkbox v-model="archived" :label="t('archived')"></q-checkbox>
          <div class="row justify-end">
            <q-btn
              :loading="updateLoading"
              color="primary"
              :label="t('save')"
              @click="updateGroup"
            ></q-btn>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const router = useRouter();
const props = defineProps({
  group: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["refreshGroup"]);

const inputGroupName = ref("");
const archived = ref(null);
const resetData = () => {
  inputGroupName.value = props.group.content.name;
  archived.value = props.group.content.archived;
};

watch(props.group, resetData);

const nameField = ref(null);

const updateLoading = ref(false);
const updateGroup = async () => {
  if (!nameField.value.validate()) {
    return;
  }
  updateLoading.value = true;
  try {
    await api.patch("/groups/" + props.group.content.id, {
      name: inputGroupName.value,
      archived: archived.value,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: t("savingSucceeded"),
      timeout: 3000,
    });
    emit("refreshGroup");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("savingFailed"),
      timeout: 6000,
    });
  } finally {
    updateLoading.value = false;
  }
};

const deleteLoading = ref(false);
const deleteGroup = async () => {
  deleteLoading.value = true;
  try {
    await api.delete("/groups/" + props.group.content.id);
    $q.notify({
      type: "positive",
      position: "top",
      message: t("group.deletingGroupSucceeded"),
      timeout: 3000,
    });
    router.replace("/admin/groups");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("group.deletingGroupFailed"),
      timeout: 6000,
    });
    deleteLoading.value = false;
  }
};

const deleteGroupPrompt = () => {
  $q.dialog({
    title: t("confirm"),
    message: t("group.deletingGroupConfirm"),
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteGroup();
  });
};
</script>
