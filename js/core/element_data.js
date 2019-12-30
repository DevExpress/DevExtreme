const WeakMap = require('./polyfills/weak_map');
const domAdapter = require('./dom_adapter');
const eventsEngine = require('../events/core/events_engine');
const MemorizedCallbacks = require('./memorized_callbacks');

const dataMap = new WeakMap();
let strategy;

const strategyChanging = new MemorizedCallbacks();
let beforeCleanData = function() {};
let afterCleanData = function() {};

const setDataStrategy = exports.setDataStrategy = function(value) {
    strategyChanging.fire(value);

    strategy = value;

    const cleanData = strategy.cleanData;

    strategy.cleanData = function(nodes) {
        beforeCleanData(nodes);

        const result = cleanData.call(this, nodes);

        afterCleanData(nodes);

        return result;
    };
};

setDataStrategy({
    data: function() {
        const element = arguments[0];
        const key = arguments[1];
        const value = arguments[2];

        if(!element) return;

        let elementData = dataMap.get(element);

        if(!elementData) {
            elementData = {};
            dataMap.set(element, elementData);
        }

        if(key === undefined) {
            return elementData;
        }

        if(arguments.length === 2) {
            return elementData[key];
        }

        elementData[key] = value;
        return value;
    },

    removeData: function(element, key) {
        if(!element) return;
        if(key === undefined) {
            dataMap.delete(element);
        } else {
            const elementData = dataMap.get(element);
            if(elementData) {
                delete elementData[key];
            }
        }
    },

    cleanData: function(elements) {
        for(let i = 0; i < elements.length; i++) {
            eventsEngine.off(elements[i]);
            dataMap.delete(elements[i]);
        }
    }
});

exports.setDataStrategy = setDataStrategy;

exports.getDataStrategy = function() {
    return strategy;
};

exports.data = function() {
    return strategy.data.apply(this, arguments);
};

exports.strategyChanging = strategyChanging;

exports.beforeCleanData = function(callback) {
    beforeCleanData = callback;
};

exports.afterCleanData = function(callback) {
    afterCleanData = callback;
};

exports.cleanData = function(nodes) {
    return strategy.cleanData.call(this, nodes);
};

exports.removeData = function(element, key) {
    return strategy.removeData.call(this, element, key);
};

exports.cleanDataRecursive = function(element, cleanSelf) {
    if(!domAdapter.isElementNode(element)) {
        return;
    }

    const childElements = element.getElementsByTagName('*');

    strategy.cleanData(childElements);

    if(cleanSelf) {
        strategy.cleanData([element]);
    }
};
