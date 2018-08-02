require("../integration/jquery");

var $ = require("jquery"),
    Class = require("../core/class"),
    Callbacks = require("../core/utils/callbacks"),
    commonUtils = require("../core/utils/common"),
    iteratorUtils = require("../core/utils/iterator"),
    isPlainObject = require("../core/utils/type").isPlainObject,
    extend = require("../core/utils/extend").extend,
    navigationDevices = require("./navigation_devices"),
    EventsMixin = require("../core/events_mixin"),
    errors = require("./errors"),
    hardwareBackButton = require("../mobile/process_hardware_back_button").processCallback,
    hideTopOverlay = require("../mobile/hide_top_overlay"),
    when = require("../core/utils/deferred").when;

var NAVIGATION_TARGETS = {
        current: "current",
        blank: "blank",
        back: "back"
    },
    STORAGE_HISTORY_KEY = "__history";

var HistoryBasedNavigationManager = Class.inherit({

    ctor: function(options) {
        options = options || {};

        this._currentItem = undefined;
        this._previousItem = undefined;

        this._createNavigationDevice(options);
    },

    _createNavigationDevice: function(options) {
        this._navigationDevice = options.navigationDevice || new navigationDevices.HistoryBasedNavigationDevice();
        this._navigationDevice.uriChanged.add(this._uriChangedHandler.bind(this));
    },

    _uriChangedHandler: function(uri) {
        while(hideTopOverlay());
        this.navigate(uri);
    },

    _syncUriWithCurrentNavigationItem: function() {
        var currentUri = this._currentItem && this._currentItem.uri;
        this._navigationDevice.setUri(currentUri, true);
    },

    _cancelNavigation: function(args) {
        this._syncUriWithCurrentNavigationItem();
        this.fireEvent("navigationCanceled", [args]);
    },

    _getDefaultOptions: function() {
        return {
            direction: "none",
            target: NAVIGATION_TARGETS.blank
        };
    },

    _updateHistory: function(uri, options) {
        this._previousItem = this._currentItem;
        this._currentItem = {
            uri: uri,
            key: uri
        };

        this._navigationDevice.setUri(uri, options.target === NAVIGATION_TARGETS.current);
    },

    _setCurrentItem: function(item) {
        this._currentItem = item;
    },

    navigate: function(uri, options) {
        options = options || {};

        var that = this,
            isFirstNavigate = !that._currentItem,
            currentItem = (that._currentItem || {}),
            targetItem = (options.item || {}),
            currentUri = currentItem.uri,
            currentKey = currentItem.key,
            targetKey = targetItem.key,
            args;

        if(uri === undefined) {
            uri = that._navigationDevice.getUri();
        }

        if(/^_back$/.test(uri)) {
            that.back();
            return;
        }

        options = extend(that._getDefaultOptions(), options || {});

        if(isFirstNavigate) {
            options.target = NAVIGATION_TARGETS.current;
        }

        args = {
            currentUri: currentUri,
            uri: uri,
            cancel: false,
            navigateWhen: [],
            options: options
        };

        that.fireEvent("navigating", [args]);
        uri = args.uri;

        if(args.cancel || currentUri === uri && (targetKey === undefined || targetKey === currentKey) && !that._forceNavigate) {
            that._cancelNavigation(args);
        } else {
            that._forceNavigate = false;
            when.apply($, args.navigateWhen).done(function() {
                commonUtils.executeAsync(function() {
                    that._updateHistory(uri, options);

                    that.fireEvent("navigated", [{
                        uri: uri,
                        previousUri: currentUri,
                        options: options,
                        item: that._currentItem
                    }]);
                });
            });
        }
    },

    back: function() {
        return this._navigationDevice.back();
    },

    previousItem: function() {
        return this._previousItem;
    },

    currentItem: function(item) {
        if(arguments.length > 0) {

            if(!item) {
                throw errors.Error("E3023");
            }

            this._setCurrentItem(item);
        } else {
            return this._currentItem;
        }
    },

    rootUri: function() {
        return this._currentItem && this._currentItem.uri;
    },

    canBack: function() {
        return true;
    },

    saveState: commonUtils.noop,
    restoreState: commonUtils.noop,
    removeState: commonUtils.noop

}).include(EventsMixin);

var StackBasedNavigationManager = HistoryBasedNavigationManager.inherit({

    ctor: function(options) {
        options = options || {};
        this.callBase(options);

        this._createNavigationStacks(options);
        hardwareBackButton.add(this._deviceBackInitiated.bind(this));
        this._stateStorageKey = options.stateStorageKey || STORAGE_HISTORY_KEY;
    },

    init: function() {
        return this._navigationDevice.init();
    },

    _createNavigationDevice: function(options) {
        if(!options.navigationDevice) {
            options.navigationDevice = new navigationDevices.StackBasedNavigationDevice();
        }
        this.callBase(options);

        this._navigationDevice.backInitiated.add(this._deviceBackInitiated.bind(this));
    },

    _uriChangedHandler: function(uri) {
        this.navigate(uri);
    },

    _createNavigationStacks: function(options) {
        this.navigationStacks = {};
        this._keepPositionInStack = options.keepPositionInStack;
        this.currentStack = new NavigationStack();
    },

    _deviceBackInitiated: function() {
        if(!hideTopOverlay()) {
            this.back({
                isHardwareButton: true
            });
        } else {
            this._syncUriWithCurrentNavigationItem();
        }
    },

    _getDefaultOptions: function() {
        return {
            target: NAVIGATION_TARGETS.blank
        };
    },

    _createNavigationStack: function() {
        var result = new NavigationStack();
        result.itemsRemoved.add(this._removeItems.bind(this));
        return result;
    },

    _setCurrentItem: function(item) {
        this._setCurrentStack(item.stack);
        this.currentStack.currentItem(item);
        this.callBase(item);
        this._syncUriWithCurrentNavigationItem();
    },

    _setCurrentStack: function(stackOrStackKey) {
        var stack,
            stackKey;

        if(typeof stackOrStackKey === "string") {
            stackKey = stackOrStackKey;
            if(!(stackKey in this.navigationStacks)) {
                this.navigationStacks[stackKey] = this._createNavigationStack();
            }
            stack = this.navigationStacks[stackKey];
        } else {
            stack = stackOrStackKey;
            stackKey = iteratorUtils.map(this.navigationStacks, function(stack, key) {
                if(stack === stackOrStackKey) {
                    return key;
                }
                return null;
            })[0];
        }
        this.currentStack = stack;
        this.currentStackKey = stackKey;
    },

    _getViewTargetStackKey: function(uri, isRoot) {
        var result;

        if(isRoot) {
            if(this.navigationStacks[uri] !== undefined) {
                result = uri;
            } else {
                for(var stackKey in this.navigationStacks) {
                    if(this.navigationStacks[stackKey].items[0].uri === uri) {
                        result = stackKey;
                        break;
                    }
                }
                result = result || uri;
            }
        } else {
            result = this.currentStackKey || uri;
        }

        return result;
    },

    _updateHistory: function(uri, options) {
        var isRoot = options.root,
            forceIsRoot = isRoot,
            forceToRoot = false,
            previousStack = this.currentStack,
            keepPositionInStack = options.keepPositionInStack !== undefined ? options.keepPositionInStack : this._keepPositionInStack;

        options.stack = options.stack || this._getViewTargetStackKey(uri, isRoot);
        this._setCurrentStack(options.stack);

        if(isRoot || !this.currentStack.items.length) {
            forceToRoot = this.currentStack === previousStack;
            forceIsRoot = true;
        }

        if(isRoot && this.currentStack.items.length) {
            if(!keepPositionInStack || forceToRoot) {
                this.currentStack.currentIndex = 0;
                if(this.currentItem().uri !== uri) {
                    this.currentStack.navigate(uri, true);
                }
            }
            options.direction = options.direction || "none";
        } else {
            var prevIndex = this.currentStack.currentIndex,
                prevItem = this.currentItem() || {};

            switch(options.target) {
                case NAVIGATION_TARGETS.blank:
                    this.currentStack.navigate(uri);
                    break;
                case NAVIGATION_TARGETS.current:
                    this.currentStack.navigate(uri, true);
                    break;
                case NAVIGATION_TARGETS.back:
                    if(this.currentStack.currentIndex > 0) {
                        this.currentStack.back(uri);
                    } else {
                        this.currentStack.navigate(uri, true);
                    }
                    break;
                default:
                    throw errors.Error("E3006", options.target);
            }

            if(options.direction === undefined) {
                var indexDelta = this.currentStack.currentIndex - prevIndex;
                if(indexDelta < 0) {
                    options.direction = this.currentStack.currentItem().backDirection || "backward";
                } else if(indexDelta > 0 && this.currentStack.currentIndex > 0) {
                    options.direction = "forward";
                } else {
                    options.direction = "none";
                }
            }
            prevItem.backDirection = options.direction === "forward" ? "backward" : "none";
        }
        options.root = forceIsRoot;

        this._currentItem = this.currentStack.currentItem();
        this._syncUriWithCurrentNavigationItem();
    },

    _removeItems: function(items) {
        var that = this;
        iteratorUtils.each(items, function(index, item) {
            that.fireEvent("itemRemoved", [item]);
        });
    },

    back: function(options) {
        options = options || {};
        var navigatingBackArgs = extend({
            cancel: false
        }, options);

        this.fireEvent("navigatingBack", [navigatingBackArgs]);

        if(navigatingBackArgs.cancel) {
            this._syncUriWithCurrentNavigationItem();
            return;
        }

        var item = this.previousItem(navigatingBackArgs.stack);

        if(item) {
            this.navigate(item.uri, {
                stack: navigatingBackArgs.stack,
                target: NAVIGATION_TARGETS.back,
                item: item
            });
        } else {
            this.callBase();
        }
    },

    rootUri: function() {
        return this.currentStack.items.length ? this.currentStack.items[0].uri : this.callBase();
    },

    canBack: function(stackKey) {
        var stack = stackKey ? this.navigationStacks[stackKey] : this.currentStack;
        return stack ? stack.canBack() : false;
    },

    saveState: function(storage) {
        if(this.currentStack.items.length) {
            var state = {
                navigationStacks: {},
                currentStackKey: this.currentStackKey
            };
            iteratorUtils.each(this.navigationStacks, function(stackKey, stack) {
                var stackState = {};
                state.navigationStacks[stackKey] = stackState;
                stackState.currentIndex = stack.currentIndex;
                stackState.items = iteratorUtils.map(stack.items, function(item) {
                    return {
                        key: item.key,
                        uri: item.uri
                    };
                });
            });

            var json = JSON.stringify(state);
            storage.setItem(this._stateStorageKey, json);
        } else {
            this.removeState(storage);
        }
    },

    restoreState: function(storage) {
        if(this.disableRestoreState) return;
        var json = storage.getItem(this._stateStorageKey);
        if(json) {
            try {
                var that = this,
                    state = JSON.parse(json);

                iteratorUtils.each(state.navigationStacks, function(stackKey, stackState) {
                    var stack = that._createNavigationStack();
                    that.navigationStacks[stackKey] = stack;
                    stack.currentIndex = stackState.currentIndex;
                    stack.items = iteratorUtils.map(stackState.items, function(item) {
                        item.stack = stack;
                        return item;
                    });
                });

                this.currentStackKey = state.currentStackKey;
                this.currentStack = this.navigationStacks[this.currentStackKey];
                this._currentItem = this.currentStack.currentItem();
                this._navigationDevice.setUri(this.currentItem().uri);
                this._forceNavigate = true;
            } catch(e) {
                this.removeState(storage);
                throw errors.Error("E3007");
            }
        }
    },

    removeState: function(storage) {
        storage.removeItem(this._stateStorageKey);
    },

    currentIndex: function() {
        return this.currentStack.currentIndex;
    },

    previousItem: function(stackKey) {
        var stack = this.navigationStacks[stackKey] || this.currentStack;
        return stack.previousItem();
    },

    getItemByIndex: function(index) {
        return this.currentStack.items[index];
    },

    clearHistory: function() {
        this._createNavigationStacks({ keepPositionInStack: this._keepPositionInStack });
    },

    itemByKey: function(itemKey) {
        var result;

        iteratorUtils.each(this.navigationStacks, function(stackKey, stack) {
            var item = stack.itemByKey(itemKey);
            if(item) {
                result = item;
                return false;
            }
        });

        return result;
    },

    currentItem: function(itemOrItemKey) {
        var item;

        if(arguments.length > 0) {
            if(typeof itemOrItemKey === "string") {
                item = this.itemByKey(itemOrItemKey);
            } else if(isPlainObject(itemOrItemKey)) {
                item = itemOrItemKey;
            }

            this.callBase(item);
        } else {
            return this.callBase();
        }
    }
});

var NavigationStack = Class.inherit({
    ctor: function(options) {
        options = options || {};
        this.itemsRemoved = Callbacks();
        this.clear();
    },
    currentItem: function(item) {
        if(item) {
            for(var i = 0; i < this.items.length; i++) {
                if(item === this.items[i]) {
                    this.currentIndex = i;
                    break;
                }
            }
        } else {
            return this.items[this.currentIndex];
        }
    },
    previousItem: function() {
        return this.items.length > 1 ? this.items[this.currentIndex - 1] : undefined;
    },
    canBack: function() {
        return this.currentIndex > 0;
    },
    clear: function() {
        this._deleteItems(this.items);
        this.items = [];
        this.currentIndex = -1;
    },
    back: function(uri) {
        this.currentIndex--;
        if(this.currentIndex < 0) {
            throw errors.Error("E3008");
        }
        var currentItem = this.currentItem();
        if(currentItem.uri !== uri) {
            this._updateItem(this.currentIndex, uri);
        }
    },
    forward: function() {
        this.currentIndex++;
        if(this.currentIndex >= this.items.length) {
            throw errors.Error("E3009");
        }
    },
    navigate: function(uri, replaceCurrent) {
        if(this.currentIndex < this.items.length && this.currentIndex > -1 && this.items[this.currentIndex].uri === uri) {
            return;
        }
        if(replaceCurrent && this.currentIndex > -1) {
            this.currentIndex--;
        }

        if(this.currentIndex + 1 < this.items.length && this.items[this.currentIndex + 1].uri === uri) {
            this.currentIndex++;
        } else {
            var toDelete = this.items.splice(this.currentIndex + 1, this.items.length - this.currentIndex - 1);
            this.items.push({
                stack: this
            });
            this.currentIndex++;
            this._updateItem(this.currentIndex, uri);
            this._deleteItems(toDelete);
        }

        return this.currentItem();
    },
    itemByKey: function(key) {
        for(var i = 0; i < this.items.length; i++) {
            var item = this.items[i];
            if(item.key === key) return item;
        }
    },
    _updateItem: function(index, uri) {
        var item = this.items[index];
        item.uri = uri;
        item.key = this.items[0].uri + "_" + index + "_" + uri;
    },
    _deleteItems: function(items) {
        if(items) {
            this.itemsRemoved.fire(items);
        }
    }
});

///#DEBUG
HistoryBasedNavigationManager.NAVIGATION_TARGETS = NAVIGATION_TARGETS;
///#ENDDEBUG

exports.HistoryBasedNavigationManager = HistoryBasedNavigationManager;
exports.StackBasedNavigationManager = StackBasedNavigationManager;
exports.NavigationStack = NavigationStack;
