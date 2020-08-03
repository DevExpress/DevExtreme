// eslint-disable-next-line no-restricted-imports
import jQuery from 'jquery';
import config from '../../core/config';
const useJQuery = config().useJQuery;

if(jQuery && useJQuery !== false) {
    config({ useJQuery: true });
}

export default function() {
    return jQuery && config().useJQuery;
}
