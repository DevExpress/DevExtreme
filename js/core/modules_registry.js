const registry = {};

export function setModule(name, module) {
    registry[name] = module;
}
export function getModule(name) {
    return registry[name];
}
