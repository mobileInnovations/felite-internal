import router from "@/router";
import { defineStore } from "pinia";
import { formatSuccess, formatError } from "@/utils/helpers/response";
import { fetchWrapper } from "@/utils/helpers/fetch-wrapper";

const baseUrl = `${import.meta.env.VITE_API_URL}/auth`;

const USERS = [
  {
    username: "admin1",
    password: "admin123",
    name: "Administrator 1",
    role: ["Admin"],
    roles: ["Admin"],
  },
  {
    username: "admin2",
    password: "admin234",
    name: "Administrator 2",
    role: ["Admin"],
    roles: ["Admin"],
  },
];

export const useAuthStore = defineStore("auth", {
  id: "auth",
  state: () => ({
    user: JSON.parse(localStorage.getItem("USER") || "null"),
    access_token: JSON.parse(localStorage.getItem("ACCESS_TOKEN") || "null"),
    roles: JSON.parse(localStorage.getItem("ROLES") || "null"),
    returnUrl: null,
  }),
  actions: {
    async login(username, password) {
      const user = USERS.find(
        (item) => item.username === username && item.password === password,
      );

      if (!user) {
        return {
          success: false,
          message: "Invalid username or password",
        };
      }

      const userData = {
        username: user.username,
        name: user.name,
        role: user.role,
      };

      // Generate a simple frontend token
      const access_token = btoa(`${user.username}:${Date.now()}`);

      this.user = userData;
      this.access_token = access_token;

      localStorage.setItem("USER", JSON.stringify(userData));
      localStorage.setItem("ACCESS_TOKEN", JSON.stringify(access_token));
      localStorage.setItem("ROLES", JSON.stringify(user.role));

      return {
        success: true,
        user: userData,
      };
    },

    async changepassword({ currentPassword, newPassword }) {
      try {
        const body = { old: currentPassword, new: newPassword };
        const { data } = await fetchWrapper.post(
          `${baseUrl}/changepassword`,
          body,
        );
        return formatSuccess("Change password successfully", data);
      } catch (error) {
        return formatError("Failed to change password", error);
      }
    },

    logout() {
      this.user = null;
      this.access_token = null;
      localStorage.removeItem("ACCESS_TOKEN");
      localStorage.removeItem("USER");
      localStorage.removeItem("ROLES");
      router.replace("/auth/login");

      // Give Vue router a moment to finish before reload (optional delay)
      setTimeout(() => location.reload(), 100);
    },

    async refresh() {
      try {
        const { data } = await fetchWrapper.post(`${baseUrl}/refresh`);
        this.access_token = data.access_token;
        localStorage.setItem("ACCESS_TOKEN", JSON.stringify(data.access_token));
      } catch (error) {
        console.error("Failed to refresh token:", error);
        this.logout(); // Optionally auto-logout on failure
      }
    },
  },
});
