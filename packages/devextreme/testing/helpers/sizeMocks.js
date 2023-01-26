import { implementationsMap } from 'core/utils/size';

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
    if(implementationsMap.for) { return; }

    implementationsMap.map = new Map();
    enumerateProperties(propertyName => {
        defaultCommonCallbacks[propertyName] = implementationsMap[propertyName];
        const newCallback = function(element, value) {
            const target = this.map.get(element);
            if(target) {
                return target[propertyName](...arguments);
            }
            return defaultCommonCallbacks[propertyName](...arguments);
        };
        implementationsMap[propertyName] = newCallback.bind(implementationsMap);
    });
    implementationsMap.for = function(target) {
        let targetCallbacks = this.map.get(target);

        if(!targetCallbacks) {
            targetCallbacks = {};
            enumerateProperties(propertyName => {
                targetCallbacks[propertyName] = function(args) { defaultCommonCallbacks[propertyName](...arguments); };
            });
            this.map.set(target, targetCallbacks);
        }

        return targetCallbacks;
    }.bind(implementationsMap);
}

export function destroySizeMocks() {
    enumerateProperties(propertyName => {
        implementationsMap[propertyName] = defaultCommonCallbacks[propertyName];
    });
    delete implementationsMap.for;
    delete implementationsMap.map;
}
