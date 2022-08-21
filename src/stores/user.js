import { defineStore } from "pinia";
import { LocalStorage } from "quasar";

export const useUserStore = defineStore("user", {
  state: () => ({
    id: null,
    role: null,
    name: null,
    session_id: null,
    token: null,
    expires: null,
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
    isAuthenticated: (state) =>
      state.token && new Date(state.expires) > new Date(),
    isAdmin: (state) => state.role === "admin",
    isTeacher: (state) => state.role === "admin" || state.role === "teacher",
  },
  actions: {
    setUser(session) {
      this.id = session.user.id;
      this.role = session.user.role;
      this.name = session.user.name;
      this.session_id = session.id;
      this.token = session.token;
      this.expires = session.expires;
      LocalStorage.set("lav_session_id", this.id);
      LocalStorage.set("lav_session_role", this.role);
      LocalStorage.set("lav_session_name", this.name);
      LocalStorage.set("lav_session_session_id", this.session_id);
      LocalStorage.set("lav_session_token", this.token);
      LocalStorage.set("lav_session_expires", this.expires);
    },
    tryLogin() {
      this.id = LocalStorage.getItem("lav_session_id");
      this.role = LocalStorage.getItem("lav_session_role");
      this.name = LocalStorage.getItem("lav_session_name");
      this.session_id = LocalStorage.getItem("lav_session_session_id");
      this.token = LocalStorage.getItem("lav_session_token");
      this.expires = LocalStorage.getItem("lav_session_expires");
    },
    clearUser() {
      this.id = null;
      this.role = null;
      this.name = null;
      this.session_id = null;
      this.token = null;
      this.expires = null;
      LocalStorage.clear();
    },
  },
});
