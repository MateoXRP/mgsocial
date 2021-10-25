export function useFullscreenLoader() {
  const {
    app: { $accessor },
  } = useContext();

  const isOpen = computed(() => $accessor.isFullscreenLoaderOpen);

  const show = () => {
    $accessor.setIsFullscreenLoaderOpen(true);
  };

  const hide = () => {
    $accessor.setIsFullscreenLoaderOpen(false);
  };

  return {
    isOpen,
    show,
    hide,
  };
}
