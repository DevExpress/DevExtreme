import { extend } from '../../core/utils/extend';
export const registry = {};

export function register(option, type, decoratorClass) {
    const decoratorsRegistry = registry;

    const decoratorConfig = {};
    decoratorConfig[option] = decoratorsRegistry[option] ? decoratorsRegistry[option] : {};
    decoratorConfig[option][type] = decoratorClass;

    extend(decoratorsRegistry, decoratorConfig);
}
