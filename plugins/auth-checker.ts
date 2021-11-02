import { defineNuxtPlugin } from '@nuxtjs/composition-api';
import { AsyncReturnType } from 'type-fest';
import { getAccessToken, getCoilUserInfo } from '~/utils/coil-api';
import { createMGSocialUser, getMGSocialInfo } from '~/utils/mg-social-api';

declare module '@nuxt/types' {
  interface Context {
    $authChecker(): Promise<boolean>;
  }
}

export default defineNuxtPlugin((context) => {
  context.$authChecker = async () => {
    const { app, $dayjs } = context;

    if (process.env.NODE_ENV === 'production') {
      const accessToken = app.$cookies.get('access-token');
      const refreshToken = app.$cookies.get('refresh-token');

      if (!refreshToken) {
        return false;
      }

      let coilUserInfo: AsyncReturnType<typeof getCoilUserInfo> | undefined;

      try {
        coilUserInfo = await getCoilUserInfo(accessToken);

        if (coilUserInfo && !coilUserInfo.email) {
          const { access_token: newAccessToken } = await getAccessToken({
            refresh_token: refreshToken,
            grant_type: 'refresh_token',
            code: null,
          });

          coilUserInfo = await getCoilUserInfo(newAccessToken);
        }
      } catch (error: any) {
        if (error.response) {
          if ([400, 401].includes(error.response.status)) {
            // expired or invalid access token
            // get a new one
            try {
              const { access_token: newAccessToken } = await getAccessToken({
                refresh_token: refreshToken,
                grant_type: 'refresh_token',
                code: null,
              });
              app.$cookies.set('access-token', newAccessToken, {
                path: '/',
                expires: $dayjs().add(1, 'hour').toDate(),
              });
              coilUserInfo = await getCoilUserInfo(newAccessToken);
            } catch (error) {
              // Refresh token is invalid
              return false;
            }
          } else {
            return false;
          }
        } else {
          return false;
        }
      }

      try {
        const mgUserInfo = await getMGSocialInfo(coilUserInfo);
        app.$accessor.auth.setUser(mgUserInfo);
      } catch (e) {
        const newUser = await createMGSocialUser(coilUserInfo);
        app.$accessor.auth.setUser(newUser);
      }
      app.$accessor.auth.setCoilInfo(coilUserInfo);
      app.$accessor.auth.setIsAuthenticated(true);
      return true;
    }

    const coilUserInfo = {
      sub: '1233211',
      email: 'sorianorobertc@gmail.com',
    };

    try {
      // const mgUserInfo = await getMGSocialInfo(coilUserInfo.email);
      app.$accessor.auth.setUser({
        guid: '13',
        first_name: 'Robert',
        last_name: 'Anderson',
        fullname: 'robertz',
        username: 'robertz',
        email: 'sorianorobertc@gmail.com',
        birthdate: '25/08/1982',
        gender: 'male',
        icon: {
          topbar:
            'https://monegram.social/avatar/roberts/topbar/df4ae870add9ac1d691a76fb249140d3.jpeg',
          smaller:
            'https://monegram.social/avatar/roberts/smaller/8b609553c5cdab4d28b99b321c95958c.jpeg',
          small:
            'https://monegram.social/avatar/roberts/small/2f122b8b12e9f6a062bfeaa06d716497.jpeg',
          larger:
            'https://monegram.social/avatar/roberts/larger/806f063e0a8dbb99fdebc24f093aa55c.jpeg',
          large:
            'https://monegram.social/avatar/roberts/large/db0250c8976adeaeded0c2ef0ff96c59.jpeg',
        },
        cover_url:
          'https://monegram.social/cover/roberts/92e100437eac1068a580dca14588e842.jpg',
        language: 'en',
        xummaddress: '',
        paymentpointer:
          '$coil.xrptipbot.com/701298d5-481d-40ff-9945-336671ab2c42',
      });
      app.$accessor.auth.setIsAuthenticated(true);
    } catch (e) {
      // TODO: Check for other error responses
      // User doesn't exist. Create it.
      const newUser = await createMGSocialUser({
        sub: coilUserInfo.sub,
        email: coilUserInfo.email,
      });
      app.$accessor.auth.setUser(newUser);
      app.$accessor.auth.setIsAuthenticated(true);
    }
    return true;
  };
});
