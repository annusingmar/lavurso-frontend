import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    id: 5,
    role: "admin",
    name: "Some Admin",
    email: "admin@example.com",
    session_id: 12,
    token: "KF7B3TA7HSWBBB2UWJNUZLLW4A",
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
