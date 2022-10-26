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
              <q-step :name="3" title="Transfer Classes" icon="group">
                xxxxx
              </q-step>
              <q-step :name="4" title="Confirm" icon="check"></q-step>
            </q-stepper>
          </q-card-section>
        </q-card>
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { ref, watch } from "vue";
import NewYearDetails from "src/components/NewYearDetails.vue";
import NewClassDetails from "src/components/NewClassDetails.vue";

const step = ref(1);

const details = ref({
  displayName: "",
  courses: 1,
});

const newClasses = ref([]);

watch(details, () => {
  if (details.value.courses < 1) {
    details.value.courses = 1;
  }
});

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
  step.value += whereTo;
  console.log(newClasses.value);
  console.log(details.value);
};
</script>
