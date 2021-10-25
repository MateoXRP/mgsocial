import type { InjectionKey } from '@nuxtjs/composition-api';

export interface CreateSnackbarOptions {
  showCloseButton?: boolean;
  closeButtonColor?: string;
  timeout?: number;
}

export type CreateSnackbar = (
  text: string,
  options?: CreateSnackbarOptions
) => void;

export const CreateSnackbarKey: InjectionKey<CreateSnackbar> =
  Symbol('CreateSnackbar');

export function useSnackbar() {
  const createSnackbar = inject(CreateSnackbarKey);

  if (!createSnackbar) {
    throw new Error('Could not resolve snackbar provider');
  }

  return createSnackbar;
}
