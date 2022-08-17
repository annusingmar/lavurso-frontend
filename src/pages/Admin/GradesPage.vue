<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-8 col-xs-10" style="min-width: 0px">
        <q-table
          title="Grades"
          :rows="grades"
          :columns="columns"
          :loading="loading"
          :pagination="{ rowsPerPage: 10 }"
          row-key="id"
        >
          <template #top-right>
            <div class="row items-end">
              <q-btn color="primary" label="new grade" to="/admin/grades/0">
              </q-btn>
            </div>
          </template>
          <template #body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                icon="mode_edit"
                @click="editGrade(props.row.id)"
              ></q-btn>
            </q-td>
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
import { useRouter } from "vue-router";

const $q = useQuasar();
const router = useRouter();

const columns = [
  {
    name: "identifier",
    required: true,
    label: "Identifier",
    align: "left",
    field: (row) => row.identifier,
    sortable: false,
  },
  {
    name: "value",
    required: true,
    label: "Value",
    align: "left",
    field: (row) => row.value,
    sortable: false,
  },
  { name: "actions", label: "Action" },
];
const loading = ref(true);
const grades = ref([]);
const getGrades = async () => {
  loading.value = true;
  try {
    const response = await api.get("/grades");
    grades.value = response.data.grades !== null ? response.data.grades : [];
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

const editGrade = (id) => router.push("/admin/grades/" + id);

getGrades();
</script>
