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
                  v-model="details"
                  @next="step += 1"
                ></NewYearDetails>
              </q-step>
              <q-step
                :name="2"
                title="New Classes"
                icon="group_add"
                :done="step > 2"
              >
                <NewClassDetails
                  v-model="newClasses"
                  @back="step -= 1"
                  @next="step += 1"
                  @add-new="addNew"
                  @remove="remove"
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

watch(details, () => {
  if (details.value.courses < 1) {
    details.value.courses = 1;
  }
});

const newClasses = ref([{}]);

const addNew = () => newClasses.value.push({});

const remove = (i) => newClasses.value.splice(i, 1);
</script>
