const dataUtils = require('../../core/element_data');
const eventsEngine = require('../../events/core/events_engine');
const WeakMap = require('../polyfills/weak_map');
const isDefined = require('./type').isDefined;
const removeEvent = require('../remove_event');

const COMPONENT_NAMES_DATA_KEY = 'dxComponents';
const ANONYMOUS_COMPONENT_DATA_KEY = 'dxPrivateComponent';

const componentNames = new WeakMap();
let nextAnonymousComponent = 0;

const getName = exports.name = function(componentClass, newName) {
    if(isDefined(newName)) {
        componentNames.set(componentClass, newName);
        return;
    }

    if(!componentNames.has(componentClass)) {
        const generatedName = ANONYMOUS_COMPONENT_DATA_KEY + nextAnonymousComponent++;
        componentNames.set(componentClass, generatedName);
        return generatedName;
    }

    return componentNames.get(componentClass);
};

exports.attachInstanceToElement = function($element, componentInstance, disposeFn) {
    const data = dataUtils.data($element.get(0));
    const name = getName(componentInstance.constructor);

    data[name] = componentInstance;

    if(disposeFn) {
        eventsEngine.one($element, removeEvent, function() {
            disposeFn.call(componentInstance);
        });
    }

    if(!data[COMPONENT_NAMES_DATA_KEY]) {
        data[COMPONENT_NAMES_DATA_KEY] = [];
    }

    data[COMPONENT_NAMES_DATA_KEY].push(name);
};

exports.getInstanceByElement = function($element, componentClass) {
    const name = getName(componentClass);

    return dataUtils.data($element.get(0), name);
};
