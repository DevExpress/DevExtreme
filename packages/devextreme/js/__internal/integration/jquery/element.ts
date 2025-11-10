import { setPublicElementWrapper } from '@ts/core/m_element';

import useJQueryFn from './use_jquery';

const useJQuery = useJQueryFn();

// eslint-disable-next-line @stylistic/max-len
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type,@typescript-eslint/explicit-module-boundary-types
export function getPublicElementJQuery($element) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return $element;
}

if (useJQuery) {
  setPublicElementWrapper(getPublicElementJQuery);
}
