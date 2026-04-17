
const EVENT_KEY = 'gramcare_consultation_event';
const NOTIFICATIONS_KEY = 'gramcare_doctor_notifications';

export const consultationEvents = {
  // Emit an event to localStorage
  emit: (data) => {
    const event = {
      ...data,
      timestamp: new Date().toISOString(),
      eventId: Math.random().toString(36).substr(2, 9)
    };
    localStorage.setItem(EVENT_KEY, JSON.stringify(event));
    // Manually dispatch storage event for the same tab
    window.dispatchEvent(new Event('storage'));
  },

  // Get current notifications (Doctor side)
  getNotifications: () => {
    const saved = localStorage.getItem(NOTIFICATIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  },

  // Add a new notification (Doctor side)
  addNotification: (notification) => {
    const notifications = consultationEvents.getNotifications();
    const newNotif = {
      ...notification,
      id: Math.random().toString(36).substr(2, 9),
      timestamp: new Date().toISOString(),
      unread: true
    };
    const updated = [newNotif, ...notifications].slice(0, 50); // Keep last 50
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
    return updated;
  },

  // Mark all as read
  markAsRead: () => {
    const notifications = consultationEvents.getNotifications();
    const updated = notifications.map(n => ({ ...n, unread: false }));
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event('storage'));
  },

  // Clear events (cleanup)
  clearEvent: () => {
    localStorage.removeItem(EVENT_KEY);
  }
};
