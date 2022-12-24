<template>
  <div class="text-h5">
    {{ details.displayName }}
  </div>
  <div class="q-gutter-y-md q-mt-sm">
    <div v-if="newClasses.length > 0" class="created q-py-sm q-px-sm">
      <div>{{ t("learning.years.newClassesMessage") }}</div>
      <div v-for="c in newClasses" :key="c.name">
        {{ c.name }} ({{ c.newDisplayName }})
      </div>
    </div>
    <div
      v-if="transferredClasses.length > 0"
      class="transferred q-py-sm q-px-sm"
    >
      <div>{{ t("learning.years.transferredClassesMessage") }}</div>
      <div v-for="c in transferredClasses" :key="c.id">
        {{ c.name }} ({{ c.display_name }}) -> {{ c.newDisplayName }}
      </div>
    </div>
    <div
      v-if="notTransferredClasses.length > 0"
      class="not-transferred q-py-sm q-px-sm"
    >
      <div>{{ t("learning.years.notTransferredClassesMessage") }}</div>
      <div v-for="c in notTransferredClasses" :key="c.id">
        {{ c.name }} ({{ c.display_name }})
      </div>
    </div>
    <div class="row justify-between">
      <q-btn
        color="primary"
        :label="t('confirm')"
        :loading="loading"
        @click="submitYear"
      ></q-btn>
      <q-btn
        :label="t('back')"
        :disable="loading"
        @click="emit('back')"
      ></q-btn>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useQuasar } from "quasar";
import { api } from "src/boot/axios";
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";

const $q = useQuasar();
const { t } = useI18n({ useScope: "global" });
const router = useRouter();

const props = defineProps({
  details: {
    type: Object,
    required: true,
  },
  newClasses: {
    type: Array,
    required: true,
  },
  transferClasses: {
    type: Array,
    required: true,
  },
});

const emit = defineEmits(["back"]);

const notTransferredClasses = computed(() =>
  props.transferClasses.filter((val) => !val.selected)
);
const transferredClasses = computed(() =>
  props.transferClasses.filter((val) => val.selected)
);

const loading = ref(false);
const submitYear = async () => {
  loading.value = true;
  const data = {
    display_name: props.details.displayName,
    new_classes: props.newClasses.map((val) => ({
      name: val.name,
      display_name: val.newDisplayName,
    })),
    transferred_classes: transferredClasses.value.map((val) => ({
      class_id: val.id,
      display_name: val.newDisplayName,
    })),
  };

  try {
    await api.post("/years/new", data);
    $q.notify({
      type: "positive",
      position: "top",
      message: t("learning.years.creatingYearSucceeded"),
      timeout: 10000,
    });
    router.replace("/admin/years");
  } catch (error) {
    if (error.response && [401, 403, 404].indexOf(error.response.status) > -1) {
      return;
    }
    $q.notify({
      type: "negative",
      position: "top",
      message: t("learning.years.creatingYearFailed"),
      timeout: 6000,
    });
    loading.value = false;
  }
};
</script>

<style scoped>
.not-transferred {
  background: rgba(255, 0, 0, 0.151);
}

.created {
  background: rgba(0, 128, 0, 0.151);
}

.transferred {
  background: rgba(0, 0, 255, 0.151);
}
</style>
