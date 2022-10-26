<template>
  <q-page>
    <div class="row flex-center q-py-lg" style="min-height: inherit">
      <div class="col-md-8 col-xs-10">
        <q-card>
          <q-card-section class="q-pb-none">
            <div class="text-h5">Start New Year</div>
          </q-card-section>
          <q-card-section class="q-pt-none">
            <q-stepper v-model="step" color="primary" flat vertical animated>
              <q-step :name="1" title="Details" icon="info" :done="step > 1">
                <NewYearDetails
                  :prop-details="details"
                  @next="setNewYearDetails"
                ></NewYearDetails>
              </q-step>
              <q-step
                :name="2"
                title="New Classes"
                icon="group_add"
                :done="step > 2"
              >
                <NewClassDetails
                  :prop-new-classes="newClasses"
                  @go-to="setNewClasses"
                ></NewClassDetails>
              </q-step>
              <q-step
                :name="3"
                title="Transfer Classes"
                icon="group"
                :done="step > 3"
              >
                <TransferClasses
                  :new-year-name="details.displayName"
                  :prop-classes="transferClasses"
                  @go-to="setTransferClasses"
                ></TransferClasses>
              </q-step>
              <q-step :name="4" title="Confirm" icon="check">
                <ConfirmNewYear
                  :details="details"
                  :new-classes="newClasses"
                  :transfer-classes="transferClasses"
                  @back="step -= 1"
                ></ConfirmNewYear>
              </q-step>
            </q-stepper>
          </q-card-section>
          <q-inner-loading :showing="loading"></q-inner-loading>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import { api } from "src/boot/axios";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import NewClassDetails from "src/components/NewClassDetails.vue";
import NewYearDetails from "src/components/NewYearDetails.vue";
import TransferClasses from "../../components/TransferClasses.vue";
import ConfirmNewYear from "../../components/ConfirmNewYear.vue";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });

const step = ref(1);

const details = ref({
  displayName: "",
  courses: 1,
});
const newClasses = ref([]);
const transferClasses = ref([]);

watch(details, () => {
  if (details.value.courses < 1) {
    details.value.courses = 1;
  }
});

const loading = ref(true);

const getClasses = async () => {
  loading.value = true;
  try {
    const response = await api.get("/classes", {
      params: { current: true },
    });
    let classes = response.data.classes !== null ? response.data.classes : [];
    transferClasses.value = classes.map((val) => ({
      id: val.id,
      name: val.name,
      display_name: val.display_name,
      selected: true,
      newDisplayName: "",
    }));
    loading.value = false;
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("dataLoadingFail"),
      timeout: 0,
      actions: [{ label: t("dismiss"), color: "white" }],
    });
  }
};
getClasses();

// we aren't supposed to mutate props from child components,
// even though it is possible create a shallow copy of, in this case, the provided object or array of objects
// and via that change the parent component's state - that actually seems to work fine
// it's even shown in an official example: https://vuejs.org/examples/#tree
// but I chose to go the 'correct' route and not do that, instead I create a deep copy of
// the object or array of objects, modify that in component state and emit it to parent on 'step' change
// more discussion: https://forum.vuejs.org/t/is-mutating-object-props-bad-practice/17448

const setNewYearDetails = (yearDetails) => {
  details.value = yearDetails;
  step.value += 1;
};

const setNewClasses = (classes, whereTo) => {
  newClasses.value = classes;
  step.value += whereTo === "next" ? 1 : -1;
};

const setTransferClasses = (classes, whereTo) => {
  transferClasses.value = classes;
  step.value += whereTo === "next" ? 1 : -1;
};
</script>
