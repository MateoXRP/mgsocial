import { Router } from 'express';
import Cookies from 'cookie-universal';
import dayjs from 'dayjs';
import { getAccessToken, getBTPToken } from '../../../utils/coil-api';

const router = Router();

router.get('/coil/refresh-access-token', async (req, res) => {
  const cookies = Cookies(req, res);
  const refreshToken = cookies.get('refresh-token');
  const result = await getAccessToken({
    code: null,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });
  cookies.set('access-token', result.access_token, {
    path: '/',
    expires: dayjs().add(1, 'hour').toDate(),
  });
  return res.json(result);
});

router.get('/coil/get-btp-token', async (req, res) => {
  const cookies = Cookies(req, res);
  const accessToken = cookies.get('access-token');
  const result = await getBTPToken(accessToken);
  return res.json(result);
});

export default router;
