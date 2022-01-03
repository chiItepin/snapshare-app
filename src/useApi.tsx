import { useState, useEffect } from 'react';
import axios, { AxiosResponse } from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '@env';
import { useSelector } from 'react-redux';
import IUser from './screens/templates/user';
import { IState } from './reducer';

interface IRequestPosts {
  createPost: (content: string) => Promise<AxiosResponse<any>>;
  togglePostLike: (postId: string) => Promise<AxiosResponse<any>>;
  getPosts: (page: number) => Promise<AxiosResponse<any>>;
}

interface IRequestUser {
  updateImage: (id: string, image: string) => Promise<AxiosResponse<any>>;
  getUser: (id: string) => Promise<AxiosResponse<any>>;
  createUser: (email: string, password: string, confirmPassword: string)
  => Promise<AxiosResponse<any>>;
}

export interface IApi {
  apiLoaded: boolean;
  fetchPosts: IRequestPosts;
  User: IRequestUser;
  loginUser: (email: string, password: string) => Promise<AxiosResponse<any>>;
}

const useApi = (): IApi => {
  const [loaded, setLoaded] = useState(false);
  const [token, setToken] = useState('');
  const user = useSelector((state: IState) => state.user);

  const baseUrl = API_URL;

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

  const User = {
    getUser: (id: string): Promise<AxiosResponse<any>> => axios.get(`${baseUrl}/api/users/${id}`, {
      headers,
    }),
    createUser: (email: string, password: string, confirmPassword: string): Promise<AxiosResponse<any>> => axios.post(`${baseUrl}/api/users/create`, {
      email,
      password,
      confirmPassword,
    }, {
      headers,
    }),
    updateImage: (id: string, image: string): Promise<AxiosResponse<any>> => axios.patch(`${baseUrl}/api/users/${id}`, {
      image,
    }, {
      headers,
    }),
  };

  const fetchPosts = {
    getPosts: (page: number): Promise<AxiosResponse<any>> => axios.get(`${baseUrl}/api/posts?page=${page}`, {
      headers,
    }),
    createPost: (content: string): Promise<AxiosResponse<any>> => axios.post(`${baseUrl}/api/posts`, {
      content,
    }, {
      headers,
    }),
    togglePostLike: (postId: string): Promise<AxiosResponse<any>> => axios.patch(`${baseUrl}/api/posts/${postId}/like`, {}, {
      headers,
    }),
  };

  useEffect(() => {
    const getToken = async () => {
      AsyncStorage.getItem('@user').then((value: any) => {
        const userModel = JSON.parse(value) as IUser;
        setToken(userModel?.token || '');
        setLoaded(true);
      });
    };
    if (!user?.token) {
      getToken();
    } else {
      setToken(user.token);
      setLoaded(true);
    }
  }, [user?.token]);

  return {
    apiLoaded: loaded,
    loginUser,
    fetchPosts,
    User,
  };
};

export default useApi;
