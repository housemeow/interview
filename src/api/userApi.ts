import axios from 'axios';
import { UserData } from '../types/userTypes';

type UserDataWithoutId = Omit<UserData, 'id'>;

const api = {
  get: () => axios.get('https://dahua.metcfire.com.tw/api/CRUDTest/a'),
  post: (user: UserDataWithoutId) => axios.post('https://dahua.metcfire.com.tw/api/CRUDTest', user),
  patch: (user: UserData) => axios.patch('https://dahua.metcfire.com.tw/api/CRUDTest', user),
  delete: (id: string) => axios.delete(`https://dahua.metcfire.com.tw/api/CRUDTest/${id}`),
};

export default api;
