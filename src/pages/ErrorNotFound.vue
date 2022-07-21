<template>
  <div class="fullscreen bg-blue text-white text-center flex flex-center">
    <div>
      <div class="text-h1">404</div>

      <div class="text-h2 q-my-lg">Not Found</div>

      <q-btn
        color="white"
        text-color="blue"
        label="Go Back"
        no-caps
        @click="router.go(-1)"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

export default defineComponent({
  name: "ErrorNotFound",
  setup() {
    const router = useRouter();
    return { router };
  },
});
</script>
