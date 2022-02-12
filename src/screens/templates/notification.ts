interface INotification {
  _id: string;
  type: 'post' | 'following';
  userId: string;
  resourceId: string;
  message: string;
  isSeen: boolean;
  createdAt: string;
}

export default INotification;
