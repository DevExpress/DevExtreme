export function stubComponent(componentName) {
    return class NoComponent {
        constructor() {
            // TODO: make correct exceptions here and in decorators
            throw new Error(`Module '${componentName}' not found`);
        }

        static getInstance() {}
    };
}
