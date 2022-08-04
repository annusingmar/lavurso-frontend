<template>
  <div class="row flex-center" style="min-height: 75vh">
    <div class="col-md-6 col-sm-10">
      <q-card>
        <q-card-section>
          <div class="row q-gutter-x-md">
            <div class="text-h4">Edit Group</div>
            <q-btn
              :loading="deleteLoading"
              color="negative"
              label="delete"
              @click="deleteGroupPrompt"
            ></q-btn>
          </div>
        </q-card-section>
        <q-card-section>
          <q-input
            filled
            label="Name"
            v-model.trim="inputGroupName"
            ref="nameField"
            autocorrect="off"
            autocapitalize="off"
            autocomplete="off"
            spellcheck="false"
            :rules="[(val) => (val && val.length > 0) || 'Must not be empty']"
          ></q-input>
          <div class="row justify-end">
            <q-btn
              :loading="updateLoading"
              color="primary"
              label="update"
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
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const props = defineProps(["group"]);
const emit = defineEmits(["refreshGroup"]);

const inputGroupName = ref("");
const resetData = () => {
  inputGroupName.value = props.group.content.name;
};

watch(props.group, resetData);

const nameField = ref(null);

const updateLoading = ref(false);
const updateGroup = async () => {
  if (
    !nameField.value.validate() ||
    inputGroupName.value === props.group.content.name
  ) {
    return;
  }
  updateLoading.value = true;
  try {
    await api.patch("/groups/" + props.group.content.id, {
      name: inputGroupName.value,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: "Updating group succeeded!",
      timeout: 3000,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Updating group failed",
      timeout: 6000,
    });
  } finally {
    updateLoading.value = false;
    emit("refreshGroup");
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
      message: "Deleting group succeeded!",
      timeout: 3000,
    });
    router.replace("/admin/groups");
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Deleting group failed",
      timeout: 6000,
    });
    deleteLoading.value = false;
  }
};

const deleteGroupPrompt = () => {
  $q.dialog({
    title: "Confirm",
    message: "Are you sure you want to delete this group?",
    cancel: true,
    persistent: true,
  }).onOk(() => {
    deleteGroup();
  });
};
</script>
