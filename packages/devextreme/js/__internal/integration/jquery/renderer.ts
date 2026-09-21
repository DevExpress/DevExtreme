import rendererBase from '@ts/core/renderer_base';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';

import useJQueryFn from './use_jquery';

const useJQuery = useJQueryFn();

if (useJQuery) {
  // @ts-expect-error
  rendererBase.set(jQuery);
}
