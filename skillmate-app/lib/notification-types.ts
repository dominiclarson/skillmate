


export const notificationTypes = [
    'session_requested',
    'session_accepted',
    'session_declined',
    'session_cancelled',
    'reminder_24h',
    'reminder_1h',
    'friend_request_received',
    'friend_request_accepted',
    'friend_request_rejected',
  ] as const;
  
  export type NotificationType = typeof notificationTypes[number];
  