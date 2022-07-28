<template>
  <div class="row flex-center" style="height: 75vh">
    <div class="col-xl-3 col-md-3 col-sm-6 col-xs-6" style="min-width: 300px">
      <q-card>
        <q-card-section>
          <div class="text-h4">Parents</div>
        </q-card-section>
        <q-card-section>
          <q-list bordered separator v-if="studentParents.length > 0">
            <q-item v-for="parent in studentParents" :key="parent.id">
              <q-item-section>{{ parent.name }}</q-item-section>
              <q-item-section side>
                <q-btn
                  @click="removeParent(parent.id)"
                  flat
                  round
                  icon="highlight_off"
                >
                  <q-tooltip>Remove parent from student</q-tooltip>
                </q-btn>
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else>No parents for student</div>
        </q-card-section>
      </q-card>
    </div>
    <div class="col-xl-3 col-md-3 col-sm-6 col-xs-6" style="min-width: 300px">
      <q-card>
        <q-card-section>
          <div class="text-h4">Add Parent</div>
        </q-card-section>
        <q-card-section>
          <q-select
            filled
            v-model="chosenParent"
            use-input
            hide-selected
            fill-input
            input-debounce
            @filter="filter"
            :options="filteredParents"
            option-label="name"
            option-value="id"
          ></q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            @click="addParent"
            :loading="addingLoading"
            color="primary"
            label="Add"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>
</template>

<script>
import { reactive, ref } from "vue";

import { api } from "src/boot/axios";
import { useQuasar } from "quasar";

export default {
  props: ["id"],
  name: "UserEditParents",
  setup(props) {
    const $q = useQuasar();
    const allParents = ref(null);
    const studentParents = ref([]);
    const filteredParents = ref(null);
    const chosenParent = ref(null);
    const addingLoading = ref(false);

    const getAllParents = () => {
      return api
        .get("/users")
        .then((response) => {
          allParents.value = [];
          allParents.value = response.data.users.filter((user) => {
            if (user.role === "parent" && !studentParents.value) {
              return true;
            } else if (user.role === "parent") {
              return !studentParents.value.some((sp) => sp.id == user.id);
            } else {
              return false;
            }
          });
        })
        .catch((error) => {
          $q.notify({
            type: "negative",
            position: "top",
            message: "Loading of data failed",
            timeout: 0,
          });
        });
    };

    const getStudentParents = () => {
      api
        .get("/students/" + props.id + "/parents")
        .then((response) => {
          studentParents.value =
            response.data.parents !== null ? response.data.parents : [];
        })
        .catch((error) => {
          $q.notify({
            type: "negative",
            position: "top",
            message: "Loading of data failed",
            timeout: 0,
          });
        });
    };

    const filter = async (val, update) => {
      if (allParents.value !== null) {
        update(() => {
          const v = val.toLowerCase();
          filteredParents.value = allParents.value.filter(
            (p) => p.name.toLowerCase().indexOf(v) > -1
          );
        });
      } else {
        await getAllParents();
        update(() => {
          filteredParents.value = allParents.value;
        });
      }
    };

    const addParent = () => {
      addingLoading.value = true;
      api
        .put("/students/" + props.id + "/parents", {
          parent_id: chosenParent.value.id,
        })
        .then(() => {
          addingLoading.value = false;
          $q.notify({
            type: "positive",
            position: "top",
            message: "Parent added successfully",
            timeout: 5000,
          });
        })
        .catch((error) => {
          $q.notify({
            type: "negative",
            position: "top",
            message: "Adding parent failed",
            timeout: 0,
          });
        });
      getStudentParents();
      chosenParent.value = null;
      allParents.value = null;
    };

    const removeParent = (pid) => {
      api
        .delete("/students/" + props.id + "/parents", {
          data: {
            parent_id: pid,
          },
        })
        .then(() => {
          $q.notify({
            type: "positive",
            position: "top",
            message: "Parent removed successfully",
            timeout: 5000,
          });
        })
        .catch((error) => {
          console.log(error);
          $q.notify({
            type: "negative",
            position: "top",
            message: "Removing parent failed",
            timeout: 0,
          });
        });
      getStudentParents();
      allParents.value = null;
    };

    getStudentParents();

    return {
      studentParents,
      filteredParents,
      chosenParent,
      addingLoading,
      filter,
      addParent,
      removeParent,
    };
  },
};
</script>
