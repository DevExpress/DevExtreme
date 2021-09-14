import { commonCallbacks } from 'core/utils/size';

const defaultCommonCallbacks = {};

function enumerateProperties(callback) {
    ['get', 'set'].forEach(kind => {
        ['Width', 'Height'].forEach(dimension => {
            ['', 'Inner', 'Outer'].forEach(location => {
                callback(kind + location + dimension);
            });
        });
    });
}

export function initializeSizeMocks() {
    if(commonCallbacks.for) { return; }

    commonCallbacks.map = new Map();
    enumerateProperties(propertyName => {
        defaultCommonCallbacks[propertyName] = commonCallbacks[propertyName];
        const newCallback = function(element, value) {
            const target = this.map.get(element);
            if(target) {
                return target[propertyName](...arguments);
            }
            return defaultCommonCallbacks[propertyName](...arguments);
        };
        commonCallbacks[propertyName] = newCallback.bind(commonCallbacks);
    });
    commonCallbacks.for = function(target) {
        let targetCallbacks = this.map.get(target);

        if(!targetCallbacks) {
            targetCallbacks = {};
            enumerateProperties(propertyName => {
                targetCallbacks[propertyName] = function(args) { defaultCommonCallbacks[propertyName](...arguments); };
            });
            this.map.set(target, targetCallbacks);
        }

        return targetCallbacks;
    }.bind(commonCallbacks);
}

export function destroySizeMocks() {
    enumerateProperties(propertyName => {
        commonCallbacks[propertyName] = defaultCommonCallbacks[propertyName];
    });
    delete commonCallbacks.for;
    delete commonCallbacks.map;
}
