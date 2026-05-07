import type { DeferredObj } from '@js/core/utils/deferred';
import { setStrategy } from '@ts/core/utils/m_deferred';
import { compare as compareVersion } from '@ts/core/utils/m_version';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';

import useJQueryFn from './use_jquery';

const useJQuery = useJQueryFn();

if (useJQuery) {
  const { Deferred } = jQuery;
  const strategy = { Deferred };

  // @ts-expect-error
  strategy.when = compareVersion(jQuery.fn.jquery, [3]) < 0
    ? jQuery.when
    // eslint-disable-next-line func-names
    : function (singleArg): DeferredObj<unknown> {
      if (arguments.length === 0) {
        // @ts-expect-error
        return (new Deferred() as DeferredObj<unknown>).resolve();
      }

      if (arguments.length === 1) {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-return
        return singleArg?.then
          ? singleArg
          // @ts-expect-error
          : (new Deferred() as DeferredObj<unknown>).resolve(singleArg);
      }
      // @ts-expect-error
      // eslint-disable-next-line prefer-spread, prefer-rest-params
      return jQuery.when.apply(jQuery, arguments);
    };

  setStrategy(strategy);
}
