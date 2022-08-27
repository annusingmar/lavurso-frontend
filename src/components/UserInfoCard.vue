<template>
  <q-card>
    <q-card-section class="q-pb-none">
      <div class="text-h6">{{ user.name }}</div>
    </q-card-section>
    <q-card-section>
      <div v-if="user.email" class="row justify-between q-mt-sm">
        <span class="q-mr-sm">Email</span>
        <span>{{ user.email }}</span>
      </div>
      <div v-if="user.phone_number" class="row justify-between q-mt-sm">
        <span class="q-mr-sm">Phone Number</span>
        <span>{{ user.phone_number }}</span>
      </div>
      <div v-if="user.id_code" class="row justify-between q-mt-sm">
        <span class="q-mr-sm">ID code</span>
        <span>{{ user.id_code }}</span>
      </div>
      <div v-if="user.birth_date" class="row justify-between q-mt-sm">
        <span class="q-mr-sm">Birth date</span>
        <span>{{ user.birth_date }}</span>
      </div>
      <div
        v-if="user.class && user.class.id"
        class="row justify-between q-mt-sm"
      >
        <span class="q-mr-sm">Class</span>
        <span>{{ user.class.name }}</span>
      </div>
      <div v-if="role" class="row justify-between q-mt-sm">
        <span class="q-mr-sm">Role</span>
        <span>{{ role }}</span>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
});

const role = computed(() => {
  if (props.user.role) {
    return t(`roles.${props.user.role}`);
  } else {
    return null;
  }
});
</script>
