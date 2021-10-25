import type { InjectionKey } from '@nuxtjs/composition-api';

export interface CreateConfirmDialogOptions {
  width?: string | number;
  showCancel?: boolean;
  persistent?: boolean;
}

export type CreateConfirmDialog = (
  title: string,
  content: string,
  options: CreateConfirmDialogOptions
) => Promise<boolean>;

export const CreateConfirmDialogKey: InjectionKey<CreateConfirmDialog> = Symbol(
  'CreateConfirmDialog'
);

export function useDialog() {
  const confirm = inject(CreateConfirmDialogKey);

  if (!confirm) {
    throw new Error('Could not resolve dialog provider');
  }

  return confirm;
}
