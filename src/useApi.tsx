import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import IUser from './screens/templates/user';

export interface IApi {
  loginUser: (email: string, password: string) => Promise<AxiosResponse<any>>;
}

const useApi = (): IApi => {
  const [token, setToken] = useState<undefined|string>('');

  useEffect(() => {
    const getToken = async () => {
      AsyncStorage.getItem('@user').then((value: any) => {
        const userModel = JSON.parse(value) as IUser;
        setToken(userModel?.token || '');
      });
    };
    getToken();
  }, []);

  const baseUrl = 'https://aefa-189-173-91-167.ngrok.io';

  const headers = {
    'Content-type': 'application/json; charset=UTF-8',
    Authorization: `Bearer ${token}`,
  };

  const loginUser = (email: string, password: string): Promise<AxiosResponse<any>> => axios.post(`${baseUrl}/api/users/login`, {
    email,
    password,
  }, {
    headers,
  });

  return {
    loginUser,
  };
};

export default useApi;
