export function stubComponent(componentName) {
  // eslint-disable-next-line @typescript-eslint/no-extraneous-class
  return class NoComponent {
    constructor() {
      // TODO: make correct exceptions here and in decorators
      throw new Error(`Module '${componentName}' not found`);
    }

    static getInstance() {}
  };
}
