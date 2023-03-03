<template>
  <q-card>
    <q-card-section class="q-pb-none row justify-between">
      <div class="text-h6">{{ user.name }}</div>
      <q-btn
        v-if="editButton"
        color="primary"
        :label="t('edit')"
        @click="emit('setEdit', true)"
      ></q-btn>
    </q-card-section>
    <q-card-section>
      <div v-if="user.email" class="row justify-between q-mt-sm">
        <span class="q-mr-sm">{{ t("email") }}</span>
        <span>{{ user.email }}</span>
      </div>
      <div v-if="user.phone_number" class="row justify-between q-mt-sm">
        <span class="q-mr-sm">{{ t("user.phoneNumber") }}</span>
        <span>{{ user.phone_number }}</span>
      </div>
      <div v-if="user.id_code" class="row justify-between q-mt-sm">
        <span class="q-mr-sm">{{ t("user.idCode") }}</span>
        <span>{{ user.id_code }}</span>
      </div>
      <div v-if="user.birth_date" class="row justify-between q-mt-sm">
        <span class="q-mr-sm">{{ t("user.birthDate") }}</span>
        <span>{{ user.birth_date }}</span>
      </div>
      <div
        v-if="user.student && user.student.class.id"
        class="row justify-between q-mt-sm"
      >
        <span class="q-mr-sm">{{ t("learning.class") }}</span>
        <span v-if="user.student.class.display_name">{{
          user.student.class.display_name
        }}</span>
        <span v-else>{{ user.student.class.name }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

defineProps({
  user: {
    type: Object,
    required: true,
  },
  editButton: {
    type: Boolean,
    required: false,
    default: false,
  },
});

const emit = defineEmits(["setEdit"]);
</script>
