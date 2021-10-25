export default function getNextPageParam(
  lastGroup: Record<any, any> | undefined
) {
  if (lastGroup && lastGroup.payload && lastGroup.payload.count) {
    const { count, offset } = lastGroup.payload;
    // Get number of pages based on total posts
    const totalPages = Math.ceil(Number(count) / 10);

    // If current page (offset) is equal to
    // totalPages, stop infinite query.
    if (Number(offset) === totalPages) return false;

    // Set next page
    return +offset + 1;
  }

  return false;
}
