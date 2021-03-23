import { AuthModel } from './auth.model';

export class UserModel extends AuthModel {
  id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  fullName: string;
  type: string;

  setUser(user: any) {
    this.id = user.id;
    this.username = user.username || '';
    this.password = user.password || '';
    this.firstName = user.firstName || '';
    this.lastName = user.lastName || '';
    this.fullName = user.fullName || '';
    this.type = user.type || '';
  }
}
