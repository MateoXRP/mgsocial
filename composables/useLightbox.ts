export function useLightbox() {
  const {
    app: { $accessor },
  } = useContext();

  const isOpen = computed(() => $accessor.isLightboxOpen);
  const imageUrl = computed(() => $accessor.lightboxImageUrl);

  const show = (payload: string) => {
    $accessor.setLightboxImageUrl(payload);
    $accessor.setIsLightboxOpen(true);
  };

  const hide = () => {
    $accessor.setIsLightboxOpen(false);
  };

  return {
    imageUrl,
    isOpen,
    show,
    hide,
  };
}
