const extend = require('../../core/utils/extend').extend;

exports.registry = {};

exports.register = function(option, type, decoratorClass) {
    let decoratorsRegistry = exports.registry;

    const decoratorConfig = {};
    decoratorConfig[option] = decoratorsRegistry[option] ? decoratorsRegistry[option] : {};
    decoratorConfig[option][type] = decoratorClass;

    decoratorsRegistry = extend(decoratorsRegistry, decoratorConfig);
};
