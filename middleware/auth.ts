import type { Context } from '@nuxt/types';

const myMiddleware = ({ redirect, app: { $accessor } }: Context) => {
  if (!$accessor.auth.isAuthenticated) {
    return redirect('/');
  }
};

export default myMiddleware;
