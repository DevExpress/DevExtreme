export class InfernoEffect {
  private destroy?: (() => void) | void;

  private effect: () => (() => void) | void;

  private dependency: Array<unknown>;

  constructor(
    effect: () => (() => void) | void,
    dependency: Array<unknown>,
  ) {
    this.dependency = dependency;
    this.effect = effect;
    this.destroy = effect();
  }

  update(dependency?: Array<unknown>): void {
    const currentDependency = this.dependency;
    if (dependency) {
      this.dependency = dependency;
    }
    if (!dependency || dependency.some((d, i) => currentDependency[i] !== d)) {
      this.dispose();
      this.destroy = this.effect();
    }
  }

  dispose(): void {
    if (this.destroy) {
      this.destroy();
    }
  }
}
