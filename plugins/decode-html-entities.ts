import { defineNuxtPlugin } from '@nuxtjs/composition-api';
import decodeHTMLEntities from '~/utils/decode-html-entities';

declare module 'vue/types/vue' {
  interface Vue {
    $decodeHTMLEntities: typeof decodeHTMLEntities;
  }
}

declare module '@nuxt/types' {
  interface Context {
    $decodeHTMLEntities: typeof decodeHTMLEntities;
  }
}

export default defineNuxtPlugin((_context, inject) => {
  inject('decodeHTMLEntities', decodeHTMLEntities);
});
