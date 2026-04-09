import { create } from "zustand";
import { persist } from "zustand/middleware";
import { UserRole } from "@/types";
import {
  getNotifications as fetchNotifications,
  markNotificationRead as dbMarkRead,
  markAllNotificationsRead as dbMarkAllRead,
  updateUser as dbUpdateUser,
  getUserById,
  type DbNotification,
} from "@/lib/actions";

// ─── Types ───
export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organization: string;
  avatar?: string;
  phone?: string;
  city?: string;
  state?: string;
}

export type { DbNotification as Notification };

interface AppState {
  currentUser: AppUser | null;
  notifications: DbNotification[];

  // Actions
  setCurrentUser: (user: AppUser) => void;
  updateProfile: (fields: Partial<AppUser>) => void;
  logout: () => void;
  loadNotifications: () => Promise<void>;
  markNotificationRead: (id: string) => void;
  markAllRead: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: null,
      notifications: [],

      setCurrentUser: (user) => set({ currentUser: user }),

      updateProfile: (fields) => {
        const cur = get().currentUser;
        if (!cur) return;
        const merged = { ...cur, ...fields };
        set({ currentUser: merged });
        // Persist to DB (fire and forget)
        dbUpdateUser(cur.id, fields as Record<string, unknown>).catch(() => {});
      },

      logout: () => set({ currentUser: null, notifications: [] }),

      loadNotifications: async () => {
        const user = get().currentUser;
        if (!user) return;
        const notifs = await fetchNotifications(user.id);
        set({ notifications: notifs });
      },

      markNotificationRead: (id) => {
        set((state) => ({
          notifications: state.notifications.map((n) =>
            n.id === id ? { ...n, read: true } : n
          ),
        }));
        dbMarkRead(id).catch(() => {});
      },

      markAllRead: () => {
        const user = get().currentUser;
        set((state) => ({
          notifications: state.notifications.map((n) => ({ ...n, read: true })),
        }));
        if (user) dbMarkAllRead(user.id).catch(() => {});
      },
    }),
    {
      name: "dv_app_store",
      partialize: (state) => ({ currentUser: state.currentUser }),
    }
  )
);
