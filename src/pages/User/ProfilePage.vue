<template>
  <q-page>
    <div
      class="row flex-center q-py-lg q-col-gutter-md"
      style="min-height: inherit; align-content: center"
    >
      <div class="col-md-3 col-xs-10">
        <UserInfoCard
          v-if="!edit"
          :user="user"
          :edit-button="true"
          @set-edit="setEdit"
        ></UserInfoCard>
        <UserInfoEditCard
          v-else
          :server-user="user"
          @set-edit="setEdit"
          @refresh-user="getUserInfo"
        ></UserInfoEditCard>
      </div>
      <div class="col-md-3 col-xs-10">
        <UserPasswordChange :id="user.id"></UserPasswordChange>
      </div>
      <div class="col-md-3 col-xs-10">
        <User2FA
          :id="user.id"
          :enabled="user.totp_enabled"
          @refresh-user="getUserInfo"
        ></User2FA>
      </div>
    </div>
    <q-inner-loading :showing="loading"></q-inner-loading>
  </q-page>
</template>

<script setup>
import { api } from "src/boot/axios";
import { useUserStore } from "src/stores/user";
import { ref } from "vue";
import { useQuasar } from "quasar";
import { useI18n } from "vue-i18n";
import UserInfoCard from "src/components/UserInfoCard.vue";
import UserInfoEditCard from "src/components/UserInfoEditCard.vue";
import UserPasswordChange from "src/components/UserPasswordChange.vue";
import User2FA from "src/components/User2FA.vue";

const { id } = useUserStore();
const { t } = useI18n({ useScope: "global" });
const $q = useQuasar();

const edit = ref(false);
const setEdit = (val) => (edit.value = val);

const user = ref({});
const loading = ref(true);
const getUserInfo = async () => {
  loading.value = true;
  try {
    const response = await api.get("/users/" + id);
    user.value = response.data.user;
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

getUserInfo();
</script>
