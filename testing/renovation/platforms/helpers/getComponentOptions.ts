/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import * as Replicator from 'replicator';

export const getComponentOptions = (): any => {
  const encodedOptions = localStorage.getItem('componentOptions');

  return encodedOptions
    ? new Replicator().decode(encodedOptions)
    : { };
};
