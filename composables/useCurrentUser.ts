export const useCurrentUser = () => {
  const {
    app: { $accessor },
  } = useContext();

  return computed(() => $accessor.auth.user);
};

export const useCurrentUserId = () => {
  const user = useCurrentUser();

  return computed(() => user.value?.guid);
};
