import { setDataStrategy } from '@ts/core/m_element_data';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';

import useJQueryFn from './use_jquery';

const useJQuery = useJQueryFn();

if (useJQuery) {
  setDataStrategy(jQuery);
}
