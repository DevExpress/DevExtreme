import type { DataStrategy } from '@ts/core/element_data';
import { setDataStrategy } from '@ts/core/element_data';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';

import useJQueryFn from './use_jquery';

const useJQuery = useJQueryFn();

if (useJQuery) {
  setDataStrategy(jQuery as unknown as DataStrategy);
}
