<template>
  <div
    class="row flex-center q-col-gutter-md"
    style="min-height: 75vh; align-content: center"
  >
    <div class="col-md-4 col-xs-10">
      <q-card>
        <q-card-section>
          <div class="text-h4">{{ t("roles.parents") }}</div>
        </q-card-section>
        <q-card-section>
          <q-list
            v-if="
              student.user.student.parents &&
              student.user.student.parents.length > 0
            "
            bordered
            separator
          >
            <q-item
              v-for="parent in student.user.student.parents"
              :key="parent.id"
            >
              <q-item-section>{{ parent.name }}</q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  icon="highlight_off"
                  @click="removeParent(parent.id)"
                >
                  <q-tooltip>{{
                    t("user.student.removeParentFromStudent")
                  }}</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else>{{ t("user.student.noParentsForStudent") }}</div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-md-4 col-xs-10">
      <q-card>
        <q-card-section>
          <div class="text-h4">{{ t("user.student.addParent") }}</div>
        </q-card-section>
        <q-card-section>
          <q-select
            v-model="chosenParent"
            filled
            use-input
            fill-input
            hide-selected
            input-debounce="200"
            stack-label
            :options="filteredParents"
            option-label="name"
            option-value="id"
            :hint="t('minimumNCharacters', [4])"
            @filter="filter"
          ></q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            :loading="addingLoading"
            :disable="chosenParent === null"
            color="primary"
            :label="t('add')"
            @click="addParent"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["refreshUser"]);
const filteredParents = ref(null);
const chosenParent = ref(null);
const addingLoading = ref(false);

const getParents = async (search) => {
  try {
    const response = await api.get("/users/search", {
      params: {
        name: search,
      },
    });
    filteredParents.value = [];
    filteredParents.value =
      response.data.result !== null
        ? response.data.result.filter((user) => {
            if (user.role === "parent" && !props.student.user.student.parents) {
              return true;
            } else if (user.role === "parent") {
              return !props.student.user.student.parents.value.some(
                (sp) => sp.id == user.id
              );
            } else {
              return false;
            }
          })
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

const filter = async (val, update, abort) => {
  if (val.length < 4) {
    abort();
    return;
  }
  await getParents(val);
  update();
};

const addParent = async () => {
  addingLoading.value = true;
  try {
    await api.put("/students/" + props.student.user.id + "/parents", {
      parent_id: chosenParent.value.id,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: t("user.student.addingParentSucceeded"),
      timeout: 3000,
    });
    chosenParent.value = null;
    filteredParents.value = null;
    emit("refreshUser");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("user.student.addingParentFailed"),
      timeout: 6000,
    });
  } finally {
    addingLoading.value = false;
  }
};

const removeParent = async (pid) => {
  try {
    await api.delete("/students/" + props.student.user.id + "/parents", {
      data: {
        parent_id: pid,
      },
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: t("user.student.removingParentSucceeded"),
      timeout: 3000,
    });
    emit("refreshUser");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("user.student.removingParentFailed"),
      timeout: 6000,
    });
  } finally {
    filteredParents.value = null;
  }
};
</script>
