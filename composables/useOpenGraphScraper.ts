import { useQuery } from 'vue-query';
import axios from 'axios';
import getUrls from 'get-urls';
import removeHashtags from '~/utils/remove-hashtags';

// TODO: Add og types
interface OgImage {
  url: string;
  width: null | number;
  height: null | number;
  type: string;
}

export interface OGSuccessResponse {
  success: true;
  ogTitle: string;
  ogUrl: string;
  ogSiteName: string;
  ogDescription: string;
  ogImage: OgImage | OgImage[];
  twitterTitle?: string;
  twitterImage?: OgImage;
  twitterDescription?: string;
  ogLocale: string;
  charset: string;
  requestUrl: string;
}

interface OGFailResponse {
  success: false;
  message: string;
}

export function useOpenGraphScraper(text: string, guid: string) {
  // Remove hashtags from string to prevent errors from og scraper.
  return useQuery<OGSuccessResponse, OGFailResponse>(
    ['og', guid],
    () =>
      axios
        .get(`/api2/open-graph-scraper?content=${removeHashtags(text)}`)
        .then((res) => {
          if (!res.data.success) {
            throw new Error(res.data);
          }

          return res.data;
        }),
    {
      enabled: !!text && !!guid && getUrls(text).size > 0,
    }
  );
}
