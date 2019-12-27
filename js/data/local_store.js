const eventsEngine = require('../events/core/events_engine');
const domAdapter = require('../core/dom_adapter');
const windowUtils = require('../core/utils/window');
const window = windowUtils.getWindow();
const Class = require('../core/class');
const abstract = Class.abstract;
const errors = require('./errors').errors;
const ArrayStore = require('./array_store');

const LocalStoreBackend = Class.inherit({

    ctor: function(store, storeOptions) {
        this._store = store;
        this._dirty = !!storeOptions.data;
        this.save();

        const immediate = this._immediate = storeOptions.immediate;
        const flushInterval = Math.max(100, storeOptions.flushInterval || 10 * 1000);

        if(!immediate) {
            const saveProxy = this.save.bind(this);
            setInterval(saveProxy, flushInterval);
            eventsEngine.on(window, 'beforeunload', saveProxy);
            if(window.cordova) {
                domAdapter.listen(domAdapter.getDocument(), 'pause', saveProxy, false);
            }
        }
    },

    notifyChanged: function() {
        this._dirty = true;
        if(this._immediate) {
            this.save();
        }
    },

    load: function() {
        this._store._array = this._loadImpl();
        this._dirty = false;
    },

    save: function() {
        if(!this._dirty) {
            return;
        }

        this._saveImpl(this._store._array);
        this._dirty = false;
    },

    _loadImpl: abstract,
    _saveImpl: abstract
});

const DomLocalStoreBackend = LocalStoreBackend.inherit({

    ctor: function(store, storeOptions) {
        const name = storeOptions.name;
        if(!name) {
            throw errors.Error('E4013');
        }
        this._key = 'dx-data-localStore-' + name;

        this.callBase(store, storeOptions);
    },

    _loadImpl: function() {
        const raw = window.localStorage.getItem(this._key);
        if(raw) {
            return JSON.parse(raw);
        }
        return [];
    },

    _saveImpl: function(array) {
        if(!array.length) {
            window.localStorage.removeItem(this._key);
        } else {
            window.localStorage.setItem(this._key, JSON.stringify(array));
        }
    }

});

const localStoreBackends = {
    'dom': DomLocalStoreBackend
};


const LocalStore = ArrayStore.inherit({

    ctor: function(options) {
        if(typeof options === 'string') {
            options = { name: options };
        } else {
            options = options || {};
        }

        this.callBase(options);

        this._backend = new localStoreBackends[options.backend || 'dom'](this, options);
        this._backend.load();
    },

    clear: function() {
        this.callBase();
        this._backend.notifyChanged();
    },

    _insertImpl: function(values) {
        const b = this._backend;
        return this.callBase(values).done(b.notifyChanged.bind(b));
    },

    _updateImpl: function(key, values) {
        const b = this._backend;
        return this.callBase(key, values).done(b.notifyChanged.bind(b));
    },

    _removeImpl: function(key) {
        const b = this._backend;
        return this.callBase(key).done(b.notifyChanged.bind(b));
    }
}, 'local');

module.exports = LocalStore;
