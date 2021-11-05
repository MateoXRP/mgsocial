import type { Context } from '@nuxt/types';

const myMiddleware = ({ redirect, app: { $accessor } }: Context) => {
  if (
    !$accessor.auth.isAuthenticated ||
    ($accessor.auth.isAuthenticated && $accessor.auth.user?.type !== 'admin')
  ) {
    return redirect('/');
  }
};

export default myMiddleware;
