<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-8 col-xs-10" style="min-width: 0px">
        <q-table
          title="Subjects"
          :rows="subjects"
          :columns="columns"
          :loading="loading"
          :pagination="{ rowsPerPage: 10 }"
          row-key="id"
        >
          <template #top-right>
            <div class="row items-end">
              <q-btn
                color="primary"
                label="new subject"
                @click="newSubjectDialog"
              >
              </q-btn>
            </div>
          </template>
          <template #body="props">
            <q-tr :props="props">
              <q-td key="name" :props="props">
                {{ props.row.name }}
                <q-popup-edit
                  v-slot="scope"
                  :model-value="props.row.name"
                  buttons
                  :validate="validateName"
                  @save="saveName(props.row.id, $event)"
                >
                  <q-input
                    v-model="scope.value"
                    dense
                    autofocus
                    :rules="[
                      (val) => (val && val.length > 0) || 'Must not be empty',
                    ]"
                    @keyup.enter.stop
                  ></q-input>
                </q-popup-edit>
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";

const $q = useQuasar();

const columns = [
  {
    name: "name",
    required: true,
    label: "Name",
    align: "left",
    field: (row) => row.name,
    sortable: false,
  },
];

const loading = ref(true);
const subjects = ref([]);
const getSubjects = async () => {
  loading.value = true;
  try {
    const response = await api.get("/subjects");
    subjects.value =
      response.data.subjects !== null ? response.data.subjects : [];
    loading.value = false;
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Loading of data failed",
      timeout: 0,
      actions: [{ label: "Dismiss", color: "white" }],
    });
  }
};

const validateName = (val) => {
  if (val && val.length > 0) {
    return true;
  }
  return false;
};

const saveName = async (id, val) => {
  try {
    await api.patch("/subjects/" + id, {
      name: val,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: "Subject changed successfully",
      timeout: 3000,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Subject change failed",
      timeout: 6000,
    });
  } finally {
    await getSubjects();
  }
};

const newSubject = async (val) => {
  try {
    await api.post("/subjects", {
      name: val,
    });
    $q.notify({
      type: "positive",
      position: "top",
      message: "Subject created successfully",
      timeout: 3000,
    });
  } catch (error) {
    $q.notify({
      type: "negative",
      position: "top",
      message: "Subject creation failed",
      timeout: 6000,
    });
  } finally {
    await getSubjects();
  }
};

const newSubjectDialog = () => {
  $q.dialog({
    title: "New Subject",
    prompt: {
      model: "",
      type: "text",
      isValid: (val) => val && val.length > 0,
    },
    cancel: true,
  }).onOk((data) => {
    newSubject(data);
  });
};

getSubjects();
</script>
