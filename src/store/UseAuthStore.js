import { create } from "zustand";
import { persist } from "zustand/middleware";

const useAuthStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      role: null,
      clientsecret: "",
      isLoggedIn: false,
      selectedAddress: null,
      activeSettingMenu: 0,

      login: ({ user, token, role }) => {
        set({
          user,
          token,
          role,
          isLoggedIn: true,
        });
      },

      logout: () =>
        set({
          user: null,
          token: null,
          role: null,
          isLoggedIn: false,
          selectedAddress: null,
        }),
      addClientSecret: (secret) => {
        set((state) => ({
          clientsecret: secret,
        }));
      },
      setSelectedAddress: (address) =>
        set({
          selectedAddress: address,
        }),
      setActiveSettingMenu: (menu) =>
        set({
          activeSettingMenu: menu,
        }),
    }),
  ),
);

export default useAuthStore;
