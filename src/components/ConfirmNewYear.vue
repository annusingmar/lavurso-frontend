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
    <div v-if="oldClasses.length > 0" class="transferred q-py-sm q-px-sm">
      <div>{{ t("learning.years.transferredClassesMessage") }}</div>
      <div v-for="c in oldClasses" :key="c.id">
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
      <q-btn color="primary" :label="t('confirm')"></q-btn>
      <q-btn :label="t('back')" @click="emit('back')"></q-btn>
    </div>
  </div>
</template>

<script setup>
import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n({ useScope: "global" });

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
const oldClasses = computed(() =>
  props.transferClasses.filter((val) => val.selected)
);
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
