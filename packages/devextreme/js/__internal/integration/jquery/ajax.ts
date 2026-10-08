import { Ajax } from '@ts/core/utils/ajax';
import { isFormData } from '@ts/core/utils/ajax_utils';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';

import useJQueryFn from './use_jquery';

const useJQuery = useJQueryFn();

if (useJQuery) {
  Ajax.inject({
    sendRequest(options) {
      if (!options.responseType && !options.upload) {
        const settings = isFormData(options.data)
          ? { ...options, processData: false, contentType: false }
          : options;

        return jQuery.ajax(settings as JQuery.AjaxSettings);
      }

      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      return this.callBase.apply(this, [options]);
    },
  });
}
