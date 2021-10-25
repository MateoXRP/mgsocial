import { ServerMiddleware } from '@nuxt/types';
import Cookies from 'cookie-universal';
import dayjs from 'dayjs';

import { getBTPToken, getAccessToken } from '../utils/coil-api';

const myServerMiddleware: ServerMiddleware = async function (req, res) {
  const queryParams = new URLSearchParams(req.originalUrl!.split('?')[1]);
  const code = queryParams.get('code');

  const cookies = Cookies(req, res);

  if (!code) {
    res.writeHead(301, {
      Location: '/',
    });
    return res.end();
  }

  try {
    const { access_token: accessToken, refresh_token: refreshToken } =
      await getAccessToken({
        code,
        grant_type: 'authorization_code',
        refresh_token: null,
      });

    try {
      const { btpToken } = await getBTPToken(accessToken);

      cookies.set('access-token', accessToken, {
        path: '/',
        expires: dayjs().add(1, 'hour').toDate(),
      });
      cookies.set('refresh-token', refreshToken, {
        path: '/',
        expires: dayjs().add(1, 'month').toDate(),
      });
      cookies.set('btp-token', btpToken, {
        path: '/',
        expires: dayjs().add(30, 'minutes').toDate(),
      });

      res.writeHead(301, {
        Location: '/home',
      });
    } catch (e: any) {
      if (e.response && e.response.status === 403) {
        cookies.set('login-fail-status', 'Coil subscription is required', {
          path: '/',
        });
      } else {
        cookies.set('login-fail-status', 'Server error', {
          path: '/',
        });
      }
      res.writeHead(301, {
        Location: '/',
      });
    }
    res.end();
  } catch (e) {
    cookies.set('login-fail-status', 'Server error', {
      path: '/',
    });
    res.writeHead(301, {
      Location: '/',
    });
    res.end();
  }
};

export default myServerMiddleware;
