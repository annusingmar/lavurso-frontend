import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    id: 1,
    role: "admin",
    name: "Some Admin",
    email: "admin@example.com",
    session_id: 12,
    token: "HVXNPTBNQIAOY542FUUZO7S4CU",
  }),
  getters: {
    roleName: (state) => {
      switch (state.role) {
        case "admin":
          return "Administrator";
        case "teacher":
          return "Teacher";
        case "parent":
          return "Parent";
        case "student":
          return "Student";
      }
    },
  },
  actions: {},
});
