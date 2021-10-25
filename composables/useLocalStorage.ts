import { useStorage } from '@vueuse/core';

export const useThemeStorage = () => {
  const { $vuetify } = useContext();
  const isDark = useStorage('mgsocial_dark_theme', $vuetify.theme.dark);

  $vuetify.theme.dark = isDark.value;

  return isDark;
};
