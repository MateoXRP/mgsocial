import { defineNuxtPlugin } from '@nuxtjs/composition-api';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import localizedFormat from 'dayjs/plugin/localizedFormat';
import updateLocale from 'dayjs/plugin/updateLocale';

dayjs.extend(relativeTime);
dayjs.extend(localizedFormat);
dayjs.extend(updateLocale);

dayjs.updateLocale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'Just now',
    m: '1m',
    mm: '%dm',
    h: '1h',
    hh: '%dh',
    d: '1d',
    dd: '%dd',
    M: 'a month',
    MM: '%d months',
    y: '1y',
    yy: '%dy',
  },
});

declare module 'vue/types/vue' {
  interface Vue {
    $dayjs: typeof dayjs;
    $dateUtils: {
      timeAgo(time: string | number, asWeeks?: boolean): string;
      localizeTimestamp(time: string | number, format: string): any;
    };
  }
}

declare module '@nuxt/types' {
  interface Context {
    $dayjs: typeof dayjs;
    $dateUtils: {
      timeAgo(time: string | number, asWeeks?: boolean): string;
      localizeTimestamp(time: string | number, format: string): any;
    };
  }
}

export default defineNuxtPlugin((_context, inject) => {
  inject('dayjs', dayjs);
  inject('dateUtils', {
    timeAgo(time: string | number, asWeeks = false) {
      const date = dayjs(dayjs.unix(Number(time)));
      const now = dayjs();
      const weekDiff = now.diff(date, 'week', true);

      if (weekDiff > 1) {
        if (asWeeks) {
          return `${Math.trunc(weekDiff)}w`;
        }

        return date.format('lll'); // Aug 16, 2018 8:02 PM
      }

      return date.fromNow(true);
    },
    localizeTimestamp(time: string | number, format = 'lll') {
      return dayjs(dayjs.unix(Number(time))).format(format);
    },
  });
});
