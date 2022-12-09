import { useMemo } from 'react';

function createIdGenerator() {
  let counter = BigInt(0);
  // eslint-disable-next-line no-plusplus
  return () => (counter++).toString(36);
}

const makeId = createIdGenerator();

export function useId(prefix: string) {
  const id = useMemo(() => prefix + makeId(), []);
  return id;
}
