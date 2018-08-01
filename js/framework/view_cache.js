var inArray = require("../core/utils/array").inArray,
    each = require("../core/utils/iterator").each,
    Class = require("../core/class"),
    EventsMixin = require("../core/events_mixin");

/**
* @name ViewCache
* @type object
* @inherits EventsMixin
* @module framework/view_cache
* @export default
* @deprecated
*/
var ViewCache = Class.inherit({
    /**
     * @name ViewCacheevents.viewRemoved
     * @type classEventType
     * @type_function_param1 e:object
     * @type_function_param1_field1 viewInfo:object
     */
    ctor: function() {
        this._cache = {};
    },

    /**
    * @name ViewCachemethods.setView
    * @publicName setView(key, viewInfo)
    * @param1 key:string
    * @param2 viewInfo:object
    */
    setView: function(key, viewInfo) {
        this._cache[key] = viewInfo;
    },

    /**
    * @name ViewCachemethods.getView
    * @publicName getView(key)
    * @param1 key:string
    * @return object
    */
    getView: function(key) {
        return this._cache[key];
    },

    /**
    * @name ViewCachemethods.removeView
    * @publicName removeView(key)
    * @param1 key:string
    * @return object
    */
    removeView: function(key) {
        var result = this._cache[key];
        if(result) {
            delete this._cache[key];
            this.fireEvent("viewRemoved", [{ viewInfo: result }]);
        }

        return result;
    },

    /**
    * @name ViewCachemethods.clear
    * @publicName clear()
    */
    clear: function() {
        var that = this;

        each(this._cache, function(key) {
            that.removeView(key);
        });
    },

    /**
    * @name ViewCachemethods.hasView
    * @publicName hasView(key)
    * @param1 key:string
    * @return boolean
    */
    hasView: function(key) {
        return key in this._cache;
    }
}).include(EventsMixin);

var NullViewCache = ViewCache.inherit({
    setView: function(key, viewInfo) {
        this.callBase(key, viewInfo);
        this.removeView(key);
    }
});

function delegateEvent(eventName, source, target) {
    source.on(eventName, function() {
        target.fireEvent(eventName, arguments);
    });
}

var ConditionalViewCacheDecorator = Class.inherit({
    ctor: function(options) {
        this._filter = options.filter;
        this._viewCache = options.viewCache;
        this.viewRemoved = this._viewCache.viewRemoved;
        delegateEvent("viewRemoved", this._viewCache, this);
    },

    setView: function(key, viewInfo) {
        this._viewCache.setView(key, viewInfo);
        if(!this._filter(key, viewInfo)) {
            this._viewCache.removeView(key);
        }
    },

    getView: function(key) {
        return this._viewCache.getView(key);
    },

    removeView: function(key) {
        return this._viewCache.removeView(key);
    },

    clear: function() {
        return this._viewCache.clear();
    },

    hasView: function(key) {
        return this._viewCache.hasView(key);
    }
}).include(EventsMixin);

var DEFAULT_VIEW_CACHE_CAPACITY = 5/* T317332 */;
var CapacityViewCacheDecorator = Class.inherit({
    ctor: function(options) {
        this._keys = [];
        this._size = options.size || DEFAULT_VIEW_CACHE_CAPACITY;
        this._viewCache = options.viewCache;
        this.viewRemoved = this._viewCache.viewRemoved;
        delegateEvent("viewRemoved", this._viewCache, this);
    },

    setView: function(key, viewInfo) {
        if(!this.hasView(key)) {
            if(this._keys.length === this._size) {
                this.removeView(this._keys[0]);
            }
            this._keys.push(key);
        }
        this._viewCache.setView(key, viewInfo);
    },

    getView: function(key) {
        var index = inArray(key, this._keys);
        if(index < 0) {
            return null;
        }

        this._keys.push(key);
        this._keys.splice(index, 1);

        return this._viewCache.getView(key);
    },

    removeView: function(key) {
        var index = inArray(key, this._keys);
        if(index > -1) {
            this._keys.splice(index, 1);
        }

        return this._viewCache.removeView(key);
    },

    clear: function() {
        this._keys = [];
        return this._viewCache.clear();
    },

    hasView: function(key) {
        return this._viewCache.hasView(key);
    }
}).include(EventsMixin);

var HistoryDependentViewCacheDecorator = Class.inherit({
    ctor: function(options) {
        this._viewCache = options.viewCache || new ViewCache();
        this._navigationManager = options.navigationManager;
        this._navigationManager.on("itemRemoved", this._onNavigationItemRemoved.bind(this));
        this.viewRemoved = this._viewCache.viewRemoved;
        delegateEvent("viewRemoved", this._viewCache, this);
    },

    _onNavigationItemRemoved: function(item) {
        this.removeView(item.key);
    },

    setView: function(key, viewInfo) {
        this._viewCache.setView(key, viewInfo);
    },

    getView: function(key) {
        return this._viewCache.getView(key);
    },

    removeView: function(key) {
        return this._viewCache.removeView(key);
    },

    clear: function() {
        return this._viewCache.clear();
    },

    hasView: function(key) {
        return this._viewCache.hasView(key);
    }
}).include(EventsMixin);

module.exports = ViewCache;
module.exports.NullViewCache = NullViewCache;
module.exports.ConditionalViewCacheDecorator = ConditionalViewCacheDecorator;
module.exports.CapacityViewCacheDecorator = CapacityViewCacheDecorator;
module.exports.HistoryDependentViewCacheDecorator = HistoryDependentViewCacheDecorator;
