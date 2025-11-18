import config from '@js/core/config';
// eslint-disable-next-line import/no-extraneous-dependencies
import jQuery from 'jquery';

// @ts-expect-error
const { useJQuery } = config();

// @ts-expect-error
if (jQuery && useJQuery !== false) {
  // @ts-expect-error
  config({ useJQuery: true });
}

// eslint-disable-next-line func-names
export default function (): boolean {
  // @ts-expect-error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return jQuery && config().useJQuery;
}
