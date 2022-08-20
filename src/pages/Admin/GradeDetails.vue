<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-6 col-xs-10">
        <q-card>
          <q-card-section>
            <div v-if="isCreate" class="text-h4">Create Grade</div>
            <div v-else class="text-h4">Update Grade</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="submitGrade" greedy>
              <q-input
                v-model.trim="identifier"
                filled
                label="Identifier"
                autocorrect="off"
                autocapitalize="off"
                autocomplete="off"
                spellcheck="false"
                :rules="[
                  (val) => (val && val.length > 0) || 'Must not be empty',
                  (val) => val.length < 4 || 'Must be less than 4 characters',
                ]"
              ></q-input>
              <q-input
                v-model.number="value"
                filled
                label="Value"
                autocorrect="off"
                autocapitalize="off"
                autocomplete="off"
                spellcheck="false"
                :rules="[(val) => (val && val > 0) || 'Must be greater than 0']"
              ></q-input>
              <div class="row justify-end q-mt-sm">
                <q-btn
                  :loading="submitLoading"
                  type="submit"
                  color="primary"
                  :label="isCreate ? 'Create' : 'Update'"
                ></q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { api } from "src/boot/axios";
import { ref, computed, reactive, watch } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
});

const isCreate = computed(() => props.id == 0);

// existing grade
const loading = ref(false);
const grade = reactive({ content: {} });
const getGrade = async () => {
  loading.value = true;
  try {
    const response = await api.get("/grades/" + props.id);
    grade.content = response.data.grade;
    loading.value = false;
  } catch (error) {
    if (error.response && error.response.status == 404) {
      router.replace("/not-found");
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

const identifier = ref("");
const value = ref(null);
const resetData = () => {
  identifier.value = grade.content.identifier;
  value.value = grade.content.value;
};

watch(grade, resetData);

if (!isCreate.value) {
  getGrade();
}

// create/update class request
const submitLoading = ref(false);
const submitGrade = async () => {
  submitLoading.value = true;
  try {
    if (!isCreate.value) {
      await api.patch("/grades/" + props.id, {
        identifier: identifier.value,
        value: value.value,
      });
    } else {
      await api.post("/grades", {
        identifier: identifier.value,
        value: value.value,
      });
    }
    $q.notify({
      type: "positive",
      position: "top",
      message: (isCreate.value ? "Creating" : "Updating") + " grade succeeded!",
      timeout: 3000,
    });
    submitLoading.value = false;
    if (isCreate.value) {
      router.replace("/admin/grades");
    }
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: (isCreate.value ? "Creating" : "Updating") + " grade failed!",
      timeout: 6000,
    });
    submitLoading.value = false;
  } finally {
    if (!isCreate.value) {
      getGrade();
    }
  }
};
</script>
