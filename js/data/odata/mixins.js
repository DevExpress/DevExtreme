// import { format } from '../../core/utils/string';
// import { map } from '../../core/utils/iterator';
import { sendRequest } from './utils';

import './query_adapter';

const DEFAULT_PROTOCOL_VERSION = 2;


// TODO: remake this mixin into component
export const SharedMethods = {

    _extractServiceOptions: function(options) {
        options = options || {};

        this._url = String(options.url).replace(/\/+$/, '');
        this._beforeSend = options.beforeSend;
        this._jsonp = options.jsonp;
        this._version = options.version || DEFAULT_PROTOCOL_VERSION;
        this._withCredentials = options.withCredentials;
        this._deserializeDates = options.deserializeDates;
        this._filterToLower = options.filterToLower;
    },

    _sendRequest: function(url, method, params, payload) {
        return sendRequest(this.version(),
            {
                url,
                method,
                params: params || {},
                payload
            },
            {
                beforeSend: this._beforeSend,
                jsonp: this._jsonp,
                withCredentials: this._withCredentials,
                deserializeDates: this._deserializeDates
            }
        );
    },

    version: function() {
        return this._version;
    }
};
