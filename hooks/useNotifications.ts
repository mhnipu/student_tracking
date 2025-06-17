'use client';

import { create } from 'zustand';
import { toast } from 'sonner';

export type NotificationType = 'success' | 'error' | 'info' | 'warning';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  createdAt: Date;
  read: boolean;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id' | 'createdAt' | 'read'>) => string;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  clearAll: () => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = `notification-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const fullNotification = {
      ...notification,
      id,
      createdAt: new Date(),
      read: false,
    };
    
    set((state) => ({
      notifications: [fullNotification, ...state.notifications],
    }));
    
    // Show toast notification
    toast[notification.type || 'info'](notification.title, {
      description: notification.message,
      duration: 5000,
    });
    
    return id;
  },
  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      ),
    }));
  },
  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((notification) => ({
        ...notification,
        read: true,
      })),
    }));
  },
  removeNotification: (id) => {
    set((state) => ({
      notifications: state.notifications.filter((notification) => notification.id !== id),
    }));
  },
  clearAll: () => {
    set({ notifications: [] });
  },
}));

export const useNotifications = () => {
  const store = useNotificationStore();
  
  return {
    notifications: store.notifications,
    unreadCount: store.notifications.filter((notification) => !notification.read).length,
    addNotification: store.addNotification,
    markAsRead: store.markAsRead,
    markAllAsRead: store.markAllAsRead,
    removeNotification: store.removeNotification,
    clearAll: store.clearAll,
  };
};