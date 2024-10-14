export interface INotificationI {
  id: number;
  title: string;
  type: string; // Có thể là 'success', 'error', 'info', v.v.
  content: string;
  createdAt: Date | null;
  userId: number;
}