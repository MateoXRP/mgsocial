import axios from 'axios';
import qs from 'qs';

// https://help.coil.com/docs/dev/get-user-info
export const getCoilUserInfo = async (token: string) => {
  const res = await axios.get<{ sub: string; email: string }>(
    `${process.env.COIL_API_URL}/user/info`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    }
  );

  return res.data;
};

// https://help.coil.com/docs/dev/post-user-btp
export const getBTPToken = async (token: string) => {
  const res = await axios({
    method: 'POST',
    url: `${process.env.COIL_API_URL}/user/btp`,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return res.data as { btpToken: string };
};

const encodedAuth = Buffer.from(
  `${process.env.COIL_CLIENT_ID}:${encodeURIComponent(
    process.env.COIL_CLIENT_SECRET!
  )}`
).toString('base64');

interface GetAccessTokenBody {
  code: string | null;
  grant_type: 'authorization_code' | 'refresh_token';
  refresh_token: string | null;
}

interface AccessTokenResponse {
  access_token: string;
  expires_in: number;
  id_token: string;
  refresh_token: string;
  scope: string;
  token_type: string;
}

// https://help.coil.com/docs/dev/post-oauth-token
export const getAccessToken = async ({
  code,
  grant_type,
  refresh_token,
}: GetAccessTokenBody) => {
  const data: Record<string, string> = {
    grant_type,
  };

  if (grant_type === 'authorization_code' && code) {
    data.code = code;
    data.redirect_uri = process.env.COIL_REDIRECT_URI!;
  } else if (grant_type === 'refresh_token' && refresh_token) {
    data.refresh_token = refresh_token;
    data.scope = 'simple_wm openid email';
  }

  const resp = await axios({
    method: 'POST',
    url: `${process.env.COIL_API_URL?.replace('api.', '')}/oauth/token`,
    data: qs.stringify(data),
    headers: {
      Authorization: `Basic ${encodedAuth}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  return resp.data as AccessTokenResponse;
};
