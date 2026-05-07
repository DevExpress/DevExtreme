import { Ajax } from '@ts/core/utils/m_ajax';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';

import useJQueryFn from './use_jquery';

const useJQuery = useJQueryFn();

if (useJQuery) {
  Ajax.inject({
    sendRequest(options) {
      if (!options.responseType && !options.upload) {
        return jQuery.ajax(options);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.callBase.apply(this, [options]);
    },
  });
}
