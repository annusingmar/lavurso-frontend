import { defineStore } from "pinia";
import { LocalStorage } from "quasar";

export const useUserStore = defineStore("user", {
  state: () => ({
    id: null,
    role: null,
    name: null,
    children: null,
    session_id: null,
    token: null,
    expires: null,
    current_year: null,
  }),
  getters: {
    isAuthenticated: (state) => state.token && state.expires > new Date(),
  },
  actions: {
    setSession(session) {
      this.session_id = session.id;
      this.token = session.token;
      this.expires = new Date(session.expires);
      LocalStorage.set("lav_session_session_id", this.session_id);
      LocalStorage.set("lav_session_token", this.token);
      LocalStorage.set("lav_session_expires", session.expires);
    },
    tryLogin() {
      this.session_id = LocalStorage.getItem("lav_session_session_id");
      this.token = LocalStorage.getItem("lav_session_token");
      this.expires = new Date(LocalStorage.getItem("lav_session_expires"));
    },
    clearUser() {
      LocalStorage.clear();
      this.id = null;
      this.role = null;
      this.name = null;
      this.children = null;
      this.session_id = null;
      this.token = null;
      this.expires = null;
    },
    setUser(data) {
      this.id = data.user.id;
      this.role = data.user.role;
      this.name = data.user.name;
      this.children = data.children;
      this.current_year = data.current_year;
    },
  },
});
