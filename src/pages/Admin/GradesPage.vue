<template>
  <div class="row flex-center" style="height: 90vh">
    <div class="col-xl-8 col-sm-10">
      <q-table
        title="Grades"
        :rows="grades"
        :columns="columns"
        :loading="loading"
        :pagination="{ rowsPerPage: 10 }"
        row-key="id"
      >
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td key="identifier" :props="props">
              {{ props.row.identifier }}
              <q-popup-edit
                :model-value="props.row.identifier"
                buttons
                :validate="validateIdentifier"
                @save="saveIdentifier(props.row.id, $event)"
                v-slot="scope"
              >
                <q-input
                  dense
                  autofocus
                  v-model="scope.value"
                  :rules="[
                    (val) => (val && val.length > 0) || 'Must not be empty',
                  ]"
                  @keyup.enter.stop
                ></q-input>
              </q-popup-edit>
            </q-td>
            <q-td key="value" :props="props">
              {{ props.row.value }}
              <q-popup-edit
                :model-value="props.row.value"
                buttons
                :validate="validateValue"
                @save="saveValue(props.row.id, $event)"
                v-slot="scope"
              >
                <q-input
                  dense
                  autofocus
                  v-model="scope.value"
                  :rules="[(val) => (val && val > 0) || 'Must be over 0']"
                  @keyup.enter.stop
                ></q-input>
              </q-popup-edit>
            </q-td>
          </q-tr>
        </template>
      </q-table>
    </div>
  </div>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { ref } from "vue";

export default {
  name: "GradesPages",
  setup() {
    const $q = useQuasar();
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
    ];
    const loading = ref(true);
    const grades = ref([]);
    const getGrades = async () => {
      loading.value = true;
      try {
        const response = await api.get("/grades");
        grades.value =
          response.data.grades !== null ? response.data.grades : [];
        loading.value = false;
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Loading of data failed",
          timeout: 0,
        });
      }
    };
    const validateIdentifier = (val) => {
      if (val && val.length > 0) {
        return true;
      }
      return false;
    };
    const validateValue = (val) => {
      if (val && val > 0) {
        return true;
      }
      return false;
    };
    const notifySuccess = () => {
      $q.notify({
        type: "positive",
        position: "top",
        message: "Grade changed successfully",
        timeout: 3000,
      });
    };
    const notifyFailure = () => {
      $q.notify({
        type: "negative",
        position: "top",
        message: "Changing grade failed",
        timeout: 6000,
      });
    };
    const saveIdentifier = async (id, val) => {
      try {
        await api.patch("/grades/" + id, {
          identifier: val,
        });
        notifySuccess();
      } catch (error) {
        notifyFailure();
      } finally {
        await getGrades();
      }
    };
    const saveValue = async (id, val) => {
      try {
        await api.patch("/grades/" + id, {
          value: Number(val),
        });
        notifySuccess();
      } catch (error) {
        notifyFailure();
      } finally {
        await getGrades();
      }
    };
    getGrades();
    return {
      columns,
      loading,
      grades,
      validateIdentifier,
      validateValue,
      saveIdentifier,
      saveValue,
    };
  },
};
</script>
