import { NotificationType, NotificationChannel } from './enums.model';

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  channel: NotificationChannel;
  title: string;
  message: string;
  isRead: boolean;
  readAt: string | null;
  createdAt: string;
}
