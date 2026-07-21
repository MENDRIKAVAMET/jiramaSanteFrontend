import { NotificationChannel, NotificationType } from './enums.model';

export interface Notification {
  id: string;
  userId: string | null;
  title: string;
  message: string;
  type: NotificationType;
  channel: NotificationChannel;
  isRead: boolean;
  createdAt: string;
}

/** Version aplatie utilisée par le tableau de la liste des notifications. */
export interface NotificationListItem {
  id: string;
  title: string;
  channel: NotificationChannel;
  sentAt: string;
  isRead: boolean;
}
