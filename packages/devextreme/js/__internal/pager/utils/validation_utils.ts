function getItemCount(itemCount: number): number {
  if (itemCount < 0) {
    return 0;
  }
  return itemCount;
}

function getPageCount(pageSize: number, itemCount: number): number {
  if (pageSize > 0 && itemCount > 0) {
    return Math.max(1, Math.ceil(itemCount / pageSize));
  }
  return 1;
}

function getPageIndex(pageIndex: number, pageSize: number, itemCount: number): number {
  if (pageIndex < 1) {
    return 1;
  }

  const pageCount = getPageCount(pageSize, itemCount);
  return Math.min(pageIndex, pageCount);
}

export function validateOptions(
  pageSize: number,
  oldPageIndex: number,
  oldItemCount: number,
): Record<string, number> {
  const itemCount = getItemCount(oldItemCount);
  const pageCount = getPageCount(pageSize, oldItemCount);
  const pageIndex = getPageIndex(oldPageIndex, pageSize, itemCount);

  return {
    pageSize,
    pageIndex,
    totalCount: itemCount,
    pageCount,
  };
}
