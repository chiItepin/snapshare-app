import IUser from './user';

interface IFollower {
  user: string & IUser;
  byUserId: string;
}

export default IFollower;
