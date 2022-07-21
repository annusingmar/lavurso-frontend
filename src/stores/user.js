import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    id: 1,
    role: "admin",
    name: "Some Admin",
    token: "AAAAAAAAAA",
  }),
  getters: {
    roleName: (state) => {
      switch (state.role) {
        case "admin":
          return "Administrator";
          break;
        case "teacher":
          return "Teacher";
          break;
        case "parent":
          return "Parent";
          break;
        case "student":
          return "Student";
          break;
      }
    },
  },
  actions: {},
});
