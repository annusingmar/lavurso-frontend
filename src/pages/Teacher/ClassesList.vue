<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-4 col-xs-10">
        <q-card>
          <q-card-section>
            <div class="text-h4">Classes</div>
          </q-card-section>
          <q-card-section>
            <q-list v-if="classes.length > 0" separator>
              <ClassListItem
                v-for="c in classes"
                :key="c.id"
                :classs="c"
              ></ClassListItem>
            </q-list>
            <div v-else>No classes found.</div>
          </q-card-section>
        </q-card>
      </div>
    </div>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { storeToRefs } from "pinia";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { ref } from "vue";
import ClassListItem from "../../components/ClassListItem.vue";

const $q = useQuasar();
const { id, role } = storeToRefs(useUserStore());

const loading = ref(true);
const classes = ref([]);
const getClasses = async () => {
  const endpoint =
    role.value === "admin" ? "/classes" : "/teachers/" + id.value + "/classes";
  loading.value = true;
  try {
    const response = await api.get(endpoint);
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

getClasses();
</script>
