<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-4 col-xs-10">
        <q-card>
          <q-card-section>
            <div class="text-h4">Classes</div>
          </q-card-section>
          <q-card-section>
            <q-list v-if="classes && classes.length > 0" separator>
              <ClassListItem
                v-for="c in classes"
                :key="c.id"
                :classs="c"
              ></ClassListItem>
            </q-list>
            <div v-else-if="!loading">No classes found.</div>
          </q-card-section>
          <q-inner-loading :showing="loading"></q-inner-loading>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { ref } from "vue";
import ClassListItem from "../../components/ClassListItem.vue";

const $q = useQuasar();
const { id, role } = useUserStore();

const loading = ref(true);
const classes = ref([]);
const getClasses = async () => {
  const endpoint =
    role === "admin" ? "/classes" : "/teachers/" + id + "/classes";
  loading.value = true;
  try {
    const response = await api.get(endpoint);
    classes.value = response.data.classes !== null ? response.data.classes : [];
    loading.value = false;
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
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

getClasses();
</script>
