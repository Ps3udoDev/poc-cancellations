import { create } from "zustand";

export type NotificationType = "success" | "error" | "info" | "warning";

export interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  message?: string;
}

interface UIState {
  /** Global loading overlay */
  isLoading: boolean;
  loadingMessage: string;
  showLoader: (message?: string) => void;
  hideLoader: () => void;

  /** Toast notifications */
  notifications: Notification[];
  notify: (
    type: NotificationType,
    title: string,
    message?: string
  ) => void;
  dismissNotification: (id: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isLoading: false,
  loadingMessage: "",

  showLoader: (message = "Consultando datos...") =>
    set({ isLoading: true, loadingMessage: message }),

  hideLoader: () => set({ isLoading: false, loadingMessage: "" }),

  notifications: [],

  notify: (type, title, message) => {
    const id = crypto.randomUUID();
    set((state) => ({
      notifications: [...state.notifications, { id, type, title, message }],
    }));
    // Auto-dismiss after 4 seconds
    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 4000);
  },

  dismissNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
