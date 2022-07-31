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
                icon="mode_edit"
                @click="editClass(props.row.id)"
              ></q-btn>
            </q-td>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useRouter } from "vue-router";

export default {
  name: "ClassesPage",
  setup() {
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
        classes.value =
          response.data.classes !== null ? response.data.classes : [];
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

    getClasses();

    return {
      columns,
      classes,
      loading,
      editClass,
    };
  },
};
</script>
