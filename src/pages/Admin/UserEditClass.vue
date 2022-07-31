<template>
  <div
    class="row flex-center q-col-gutter-md"
    style="min-height: 75vh; align-content: center"
  >
    <div class="col-md-4 col-sm-10">
      <q-card>
        <q-card-section>
          <div class="text-h4">Class</div>
        </q-card-section>
        <q-card-section>
          <q-select
            filled
            v-model="chosenClass"
            use-input
            hide-selected
            fill-input
            input-debounce
            @filter="filter"
            :options="filteredClasses"
            option-label="name"
            option-value="id"
          ></q-select>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            @click="setClass"
            :loading="setLoading"
            :disable="!chosenClass"
            color="primary"
            label="set"
          ></q-btn>
        </q-card-actions>
      </q-card>
    </div>
  </div>

  <q-inner-loading :showing="loading"></q-inner-loading>
</template>

<script>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { reactive, ref, watch } from "vue";

export default {
  name: "UserEditClass",
  props: ["id"],
  setup(props) {
    const $q = useQuasar();

    // get current

    const loading = ref(true);
    const usersClass = ref(null);
    const chosenClass = ref(null);
    const getUsersClass = async () => {
      loading.value = true;
      try {
        const response = await api.get("/students/" + props.id + "/class");
        usersClass.value = response.data.class;
        loading.value = false;
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Loading data failed",
          timeout: 0,
          actions: [{ label: "Dismiss", color: "white" }],
        });
      }
    };

    const resetData = () => (chosenClass.value = usersClass.value);
    watch(usersClass, resetData);

    // get all

    const allClasses = ref(null);
    const getAllClasses = async () => {
      try {
        const response = await api.get("/classes");
        allClasses.value =
          response.data.classes !== null ? response.data.classes : [];
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

    const filteredClasses = ref([]);
    const filter = async (val, update) => {
      if (allClasses.value !== null) {
        update(() => {
          const v = val.toLowerCase();
          filteredClasses.value = allClasses.value.filter(
            (p) => p.name.toLowerCase().indexOf(v) > -1
          );
        });
      } else {
        await getAllClasses();
        update(() => {
          filteredClasses.value = allClasses.value;
        });
      }
    };

    const setLoading = ref(false);
    const setClass = async () => {
      setLoading.value = true;
      try {
        await api.put("/students/" + props.id + "/class", {
          class_id: chosenClass.value.id,
        });
        $q.notify({
          type: "positive",
          position: "top",
          message: "Class set successfully",
          timeout: 5000,
        });
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Setting class failed",
          timeout: 0,
          actions: [{ label: "Dismiss", color: "white" }],
        });
      } finally {
        getUsersClass();
        setLoading.value = false;
      }
    };

    getUsersClass();

    return {
      loading,
      chosenClass,
      filteredClasses,
      setLoading,
      filter,
      setClass,
    };
  },
};
</script>
