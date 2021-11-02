import crypto from 'crypto';
import axios from 'axios';
import { Merge } from 'type-fest';
import qs from 'qs';

import { OSSNWebServiceResponse } from '~/types';
import { User } from '~/composables/useUserDetail';

type MGSocialInfoResponse = Merge<OSSNWebServiceResponse, { payload: User }>;

export const getBaseMGSocialInfo = async ({
  key,
  value,
  sub,
}: {
  key: string;
  value: string;
  sub: string;
}) => {
  const { data } = await axios.get<MGSocialInfoResponse>(
    `${process.env.MG_API_URL}/user_details`,
    {
      params: {
        api_key_token: process.env.MG_API_TOKEN,
        [key]: value,
        sub,
      },
    }
  );

  if (data.code === '100') {
    return data.payload;
  }

  throw new Error(data.message);
};

export const getMGSocialInfo = ({
  email,
  sub,
}: {
  email: string;
  sub: string;
}) => {
  return getBaseMGSocialInfo({
    key: 'email',
    value: email,
    sub,
  });
};

export const getMGSocialInfoByUsername = async ({
  username,
  sub,
}: {
  username: string;
  sub: string;
}) => {
  return await getBaseMGSocialInfo({
    key: 'username',
    value: username,
    sub,
  });
};

type CreateUserBody = {
  sub: string;
  email: string;
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
