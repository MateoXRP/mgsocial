import { defineNuxtPlugin } from '@nuxtjs/composition-api';
import { AxiosResponse } from 'axios';
import qs from 'qs';

// This routes uses formData
// therefore needs to be excluded
// from stringify.
const formDataRoutes = [
  '/api/wall_add',
  '/api/comment_add',
  '/api/photos_profile_add',
  '/api/photos_cover_add',
];

// List of routes that should bypass
// reponse code error checking.
const bypassResponseRoutes: Record<string, string[]> = {
  '/api/comments_list': ['102'], // 102 means no comment for post
};

/**
 * Throws an error if code from response is not 100
 * @param response Axios response
 */
function checkResponseCode(response: AxiosResponse) {
  const { data, config } = response;

  if (typeof config.url === 'string' && data.merchant && data.code !== '100') {
    if (
      bypassResponseRoutes[config.url] &&
      bypassResponseRoutes[config.url].includes(data.code)
    ) {
      return;
    }

    throw new Error(`[${config.url}] ${data.message}`);
  }
}

export default defineNuxtPlugin(({ $axios }) => {
  $axios.onRequest((config) => {
    if (!formDataRoutes.includes(config.url!)) {
      config.data = qs.stringify(config.data);
    }
  });

  $axios.onResponse((response) => {
    checkResponseCode(response);
  });
});
