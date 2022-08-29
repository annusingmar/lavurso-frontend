<template>
  <div
    class="row flex-center q-col-gutter-md"
    style="min-height: 75vh; align-content: center"
  >
    <div class="col-sm-4 col-xs-10">
      <UserInfoCard :user="student"></UserInfoCard>
    </div>
    <div class="col-sm-4 col-xs-10">
      <q-card>
        <q-card-section class="q-pb-none">
          <div class="text-h6">{{ t("roles.parents") }}</div>
        </q-card-section>
        <q-card-section
          v-if="parents && parents.length > 0"
          class="q-gutter-md"
        >
          <UserInfoCard
            v-for="parent in parents"
            :key="parent.id"
            :user="parent"
          ></UserInfoCard>
        </q-card-section>
        <q-card-section v-else>
          <div class="text-italic">
            {{ t("user.student.noParentsForStudent") }}
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup>
import UserInfoCard from "./UserInfoCard.vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  student: {
    type: Object,
    required: true,
  },
  parents: {
    type: Array,
    required: false,
    default: null,
  },
});
</script>
