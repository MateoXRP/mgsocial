import crypto from 'crypto';
import axios from 'axios';
import { Merge } from 'type-fest';
import qs from 'qs';

import { OSSNWebServiceResponse } from '~/types';
import { User } from '~/composables/useUserDetail';

type MGSocialInfoResponse = Merge<OSSNWebServiceResponse, { payload: User }>;

export const getBaseMGSocialInfo = async (key: string, value: string) => {
  const { data } = await axios.get<MGSocialInfoResponse>(
    `${process.env.MG_API_URL}/user_details`,
    {
      params: {
        api_key_token: process.env.MG_API_TOKEN,
        [key]: value,
      },
    }
  );

  if (data.code === '100') {
    return data.payload;
  }

  throw new Error(data.message);
};

export const getMGSocialInfo = async (email: string) => {
  return await getBaseMGSocialInfo('email', email);
};

export const getMGSocialInfoByUsername = async (username: string) => {
  return await getBaseMGSocialInfo('username', username);
};

type CreateUserBody = {
  email: string;
  coil_refresh_token: string;
};

type NewUserResponse = Merge<OSSNWebServiceResponse, { payload: User }>;

export const createMGSocialUser = async (body: CreateUserBody) => {
  const newUser = qs.stringify({
    ...body,
    reemail: body.email,
    password: crypto.randomBytes(20).toString('hex'),
    api_key_token: process.env.MG_API_TOKEN,
  });

  const { data } = await axios.post<NewUserResponse>(
    `${process.env.MG_API_URL}/user_add_coil`,
    newUser
  );

  if (data.code === '100') {
    return data.payload;
  }

  throw new Error(data.message);
};
