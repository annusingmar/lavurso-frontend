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
  }),
  getters: {
    isAuthenticated: (state) => state.token && state.expires > new Date(),
  },
  actions: {
    setUser(session) {
      this.id = session.user.id;
      this.role = session.user.role;
      this.name = session.user.name;
      this.children = session.user.children ? session.user.children : null;
      this.session_id = session.id;
      this.token = session.token;
      this.expires = new Date(session.expires);
      LocalStorage.set("lav_session_id", this.id);
      LocalStorage.set("lav_session_role", this.role);
      LocalStorage.set("lav_session_name", this.name);
      LocalStorage.set("lav_session_children", this.children);
      LocalStorage.set("lav_session_session_id", this.session_id);
      LocalStorage.set("lav_session_token", this.token);
      LocalStorage.set("lav_session_expires", this.expires);
    },
    tryLogin() {
      this.id = LocalStorage.getItem("lav_session_id");
      this.role = LocalStorage.getItem("lav_session_role");
      this.name = LocalStorage.getItem("lav_session_name");
      this.children = LocalStorage.getItem("lav_session_children");
      this.session_id = LocalStorage.getItem("lav_session_session_id");
      this.token = LocalStorage.getItem("lav_session_token");
      this.expires = LocalStorage.getItem("lav_session_expires");
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
  },
});
