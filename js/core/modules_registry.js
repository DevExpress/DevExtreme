const registry = {};

export function setModule(name, module) {
    registry[name] = module;
}
export function getModule(name) {
    return registry[name];
}

export function componentGetter(path) {
    class NoComponent {
        constructor() {
            // TODO: make correct exceptions here and in decorators
            throw new Error(`Module '${path}' not found`);
        }

        static getInstance() {}
    }

    return () => getModule(path) || NoComponent;
}
