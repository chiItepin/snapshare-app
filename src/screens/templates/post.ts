import IUser from './user';

interface IPost {
  _id: string;
  tags: string[];
  categories: [];
  content: string;
  authorId: IUser;
  images: [];
  comments: [];
  likes: [];
  createdAt?: string;
  updatedAt?: string;
}

export default IPost;
