export default function getNextPageParam(lastGroup: unknown) {
  // @ts-ignore
  if (lastGroup && lastGroup.payload && lastGroup.payload.count) {
    // @ts-ignore
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
