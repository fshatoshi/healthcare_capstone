import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  id: string;
  message: string;
  read: boolean;
  time: string;
  type: string;
}

interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

const initialState: NotificationState = {
  notifications: [
    { id: 'n-1', message: 'Your AI analysis is ready to view', read: false, time: '5m ago', type: 'AI' },
    { id: 'n-2', message: 'Dr. El Alaoui left a note on your file', read: false, time: '1h ago', type: 'DOCTOR' },
    { id: 'n-3', message: 'Time to log your daily vitals', read: true, time: '3h ago', type: 'REMINDER' },
  ],
  unreadCount: 2,
};

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    markAllRead(state) {
      state.notifications = state.notifications.map(n => ({ ...n, read: true }));
      state.unreadCount = 0;
    },
    markRead(state, action: PayloadAction<string>) {
      const notif = state.notifications.find(n => n.id === action.payload);
      if (notif && !notif.read) {
        notif.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
  },
});

export const { markAllRead, markRead } = notificationSlice.actions;
export default notificationSlice.reducer;