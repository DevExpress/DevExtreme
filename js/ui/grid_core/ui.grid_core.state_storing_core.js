import eventsEngine from '../../events/core/events_engine';
import { getWindow } from '../../core/utils/window';
import modules from './ui.grid_core.modules';
import errors from '../widget/ui.errors';
import browser from '../../core/utils/browser';
import { sessionStorage } from '../../core/utils/storage';
import { extend } from '../../core/utils/extend';
import { each } from '../../core/utils/iterator';
import { isDefined, isPlainObject } from '../../core/utils/type';
import { fromPromise } from '../../core/utils/deferred';

const DATE_REGEX = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/;

const parseDates = function(state) {
    if(!state) return;
    each(state, function(key, value) {
        let date;
        if(isPlainObject(value) || Array.isArray(value)) {
            parseDates(value);
        } else if(typeof value === 'string') {
            date = DATE_REGEX.exec(value);
            if(date) {
                state[key] = new Date(Date.UTC(+date[1], +date[2] - 1, +date[3], +date[4], +date[5], +date[6]));
            }
        }
    });
};

exports.StateStoringController = modules.ViewController.inherit((function() {
    const getStorage = function(options) {
        const storage = options.type === 'sessionStorage' ? sessionStorage() : getWindow().localStorage;

        if(!storage) {
            if(getWindow().location.protocol === 'file:' && browser.msie) {
                throw new Error('E1038');
            } else {
                throw new Error('E1007');
            }
        }

        return storage;
    };

    const getUniqueStorageKey = function(options) {
        return isDefined(options.storageKey) ? options.storageKey : 'storage';
    };

    return {
        _loadState: function() {
            const options = this.option('stateStoring');

            if(options.type === 'custom') {
                return options.customLoad && options.customLoad();
            }
            try {
                return JSON.parse(getStorage(options).getItem(getUniqueStorageKey(options)));
            } catch(e) {
                errors.log(e.message);
            }
        },

        _saveState: function(state) {
            const options = this.option('stateStoring');

            if(options.type === 'custom') {
                options.customSave && options.customSave(state);
                return;
            }
            try {
                getStorage(options).setItem(getUniqueStorageKey(options), JSON.stringify(state));
            } catch(e) {
            }
        },

        publicMethods: function() {
            return ['state'];
        },

        isEnabled: function() {
            return this.option('stateStoring.enabled');
        },

        init: function() {
            const that = this;

            that._state = {};
            that._isLoaded = false;
            that._isLoading = false;

            that._windowUnloadHandler = function() {
                if(that._savingTimeoutID !== undefined) {
                    that._saveState(that.state());
                }
            };

            eventsEngine.on(getWindow(), 'unload', that._windowUnloadHandler);

            return that;
        },

        isLoaded: function() {
            return this._isLoaded;
        },

        isLoading: function() {
            return this._isLoading;
        },

        load: function() {
            const that = this;
            let loadResult;

            that._isLoading = true;
            loadResult = fromPromise(that._loadState());
            loadResult.done(function(state) {
                that._isLoaded = true;
                that._isLoading = false;
                that.state(state);
            });
            return loadResult;
        },

        state: function(state) {
            const that = this;

            if(!arguments.length) {
                return extend(true, {}, that._state);
            } else {
                that._state = extend({}, state);
                parseDates(that._state);
            }
        },

        save: function() {
            const that = this;

            clearTimeout(that._savingTimeoutID);
            that._savingTimeoutID = setTimeout(function() {
                that._saveState(that.state());
                that._savingTimeoutID = undefined;
            }, that.option('stateStoring.savingTimeout'));
        },

        optionChanged: function(args) {
            const that = this;

            switch(args.name) {
                case 'stateStoring':
                    if(that.isEnabled() && !that.isLoading()) {
                        that.load();
                    }

                    args.handled = true;
                    break;
                default:
                    that.callBase(args);
            }
        },

        dispose: function() {
            clearTimeout(this._savingTimeoutID);
            eventsEngine.off(getWindow(), 'unload', this._windowUnloadHandler);
        }
    };
})());
