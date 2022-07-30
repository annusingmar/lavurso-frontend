<template>
  <q-page>
    <div class="row flex-center" style="min-height: 90vh">
      <div class="col-md-6 col-sm-12">
        <q-card>
          <q-card-section>
            <div class="text-h4">Create Grade</div>
          </q-card-section>
          <q-card-section>
            <q-form @submit.prevent="createGrade">
              <q-input
                filled
                label="Identifier"
                v-model.trim="identifier"
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
                filled
                label="Value"
                v-model.number="value"
                autocorrect="off"
                autocapitalize="off"
                autocomplete="off"
                spellcheck="false"
                :rules="[(val) => (val && val > 0) || 'Must be greater than 0']"
              ></q-input>
              <div class="row justify-end q-mt-sm">
                <q-btn
                  :loading="createLoading"
                  type="submit"
                  color="primary"
                  label="Create"
                ></q-btn>
              </div>
            </q-form>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script>
import { api } from "src/boot/axios";
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useRouter } from "vue-router";

export default {
  name: "GradesNew",
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    const identifier = ref("");
    const value = ref(null);
    const createLoading = ref(false);

    const createGrade = async () => {
      createLoading.value = true;
      try {
        await api.post("/grades", {
          identifier: identifier.value,
          value: value.value,
        });
        $q.notify({
          type: "positive",
          position: "top",
          message: "Creating grade succeeded!",
          timeout: 3000,
        });
        router.replace("/admin/grades");
      } catch (error) {
        $q.notify({
          type: "negative",
          position: "top",
          message: "Creating grade failed",
          timeout: 6000,
        });
      } finally {
        createLoading.value = false;
      }
    };

    return {
      identifier,
      value,
      createLoading,
      createGrade,
    };
  },
};
</script>
