import { useMemo } from 'react';

function createIdGenerator() {
  let counter = BigInt(0); 
  return () => (counter++).toString(36);
}

const  makeId = createIdGenerator();

export function useId() {
  const id = useMemo(() => makeId(), []);
  return id;
}
