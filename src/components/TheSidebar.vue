<template>
  <q-drawer
    show-if-above
    :model-value="open"
    side="left"
    elevated
    @update:model-value="drawerStateChange"
  >
    <q-img src="~assets/beach.jpg" style="height: 200px">
      <div class="absolute-bottom row items-end">
        <div class="col">
          <div class="text-weight-bold">{{ name }}</div>
          <div>{{ roleName }}</div>
        </div>
        <div class="col-auto">
          <q-btn
            color="primary"
            text-color="white"
            :loading="logoutLoading"
            @click="logOut"
            >Log out</q-btn
          >
        </div>
      </div>
    </q-img>
    <q-list>
      <q-item>
        <q-item-section>
          <q-item-label>Dark mode</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-toggle
            color="grey"
            :model-value="$q.dark.isActive"
            checked-icon="dark_mode"
            unchecked-icon="light_mode"
            @update:model-value="changeDarkMode"
          ></q-toggle>
        </q-item-section>
      </q-item>
      <q-item>
        <q-item-section>
          <q-item-label>Language</q-item-label>
        </q-item-section>
        <q-item-section avatar>
          <q-select
            v-model="lang"
            :options="availableLanguages"
            dense
            borderless
            options-dense
            map-options
          ></q-select>
        </q-item-section>
      </q-item>
      <q-separator></q-separator>
      <DrawerUserItems />
      <DrawerStudentItems v-if="role === 'student'" :id="id" />
      <template v-else-if="role === 'parent'">
        <DrawerStudentItems
          v-for="c in children"
          :id="c.id"
          :key="c.id"
          :name="c.name"
        ></DrawerStudentItems>
      </template>
      <DrawerTeacherItems
        v-if="role === 'admin' || role === 'teacher'"
        :role="role"
      />
      <DrawerAdminItems v-if="role === 'admin'" />
    </q-list>
    <div
      class="row justify-center items-end absolute-bottom q-mb-sm q-gutter-x-sm"
    >
      <div>Lavurso</div>
      <q-btn
        href="https://github.com/annusingmar/lavurso"
        target="_blank"
        label="Source Code"
        icon="build"
        dense
        square
        size="sm"
      ></q-btn>
    </div>
  </q-drawer>
</template>

<script setup>
import { useQuasar } from "quasar";
import { useUserStore } from "../stores/user.js";
import { ref, watch } from "vue";
import { useI18n } from "vue-i18n";
import { api } from "src/boot/axios.js";
import { useRouter } from "vue-router";
import DrawerUserItems from "./DrawerUserItems.vue";
import DrawerStudentItems from "./DrawerStudentItems.vue";
import DrawerTeacherItems from "./DrawerTeacherItems.vue";
import DrawerAdminItems from "./DrawerAdminItems.vue";

const $q = useQuasar();
const router = useRouter();
const i18n = useI18n({ useScope: "global" });

const { id, name, role, roleName, session_id, children, clearUser } =
  useUserStore();

const props = defineProps({
  open: {
    type: Boolean,
    required: true,
  },
});
const emit = defineEmits(["setLeftDrawer"]);

const changeDarkMode = (val) => $q.dark.set(val);

const lang = ref(i18n.locale.value);

const availableLanguages = [
  {
    label: "eesti",
    value: "et",
  },
  {
    label: "English",
    value: "en-US",
  },
];

watch(lang, () => {
  i18n.locale.value = lang.value.value;
  import(`../../node_modules/quasar/lang/${lang.value.value}.mjs`).then((l) =>
    $q.lang.set(l.default)
  );
});

const drawerStateChange = (val) => {
  emit("setLeftDrawer", val);
};

const logoutLoading = ref(false);
const logOut = async () => {
  logoutLoading.value = true;
  try {
    await api.delete("/sessions/" + session_id);
    clearUser();
    router.replace("/login");
  } catch (error) {
    console.log("fail");
  } finally {
    logoutLoading.value = false;
  }
};
</script>
