<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: 90vh">
      <div class="col-xl-8 col-sm-10" style="min-width: 0px">
        <q-table
          title="Classes"
          :rows="classes"
          :columns="columns"
          :loading="loading"
          :pagination="{ rowsPerPage: 10 }"
          row-key="id"
        >
          <template v-slot:top-right>
            <div class="row items-end">
              <q-btn color="primary" label="new class" to="/admin/classes/0">
              </q-btn>
            </div>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                icon="people"
                @click="showMembers(props.row.id)"
              ></q-btn>
              <q-btn
                flat
                icon="mode_edit"
                @click="editClass(props.row.id)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>

    <q-dialog v-model="dialog">
      <q-card>
        <q-card-section>
          <div class="text-h4">Class Students</div>
        </q-card-section>
        <q-card-section>
          <ClassMembersTable :id="showClassID"></ClassMembersTable>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="close" color="primary" v-close-popup></q-btn>
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useRouter } from "vue-router";
import ClassMembersTable from "src/components/ClassMembersTable.vue";

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
    name: "teacher",
    required: true,
    label: "Teacher",
    align: "left",
    field: (row) => row.teacher.name,
    sortable: true,
  },
  { name: "actions", label: "Action" },
];
const loading = ref(true);
const classes = ref([]);
const getClasses = async () => {
  loading.value = true;
  try {
    const response = await api.get("/classes");
    classes.value = response.data.classes !== null ? response.data.classes : [];
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
const editClass = (id) => router.push("/admin/classes/" + id);
const showClassID = ref(null);
const dialog = ref(false);
const showMembers = (id) => {
  showClassID.value = id;
  dialog.value = true;
};
getClasses();
</script>
