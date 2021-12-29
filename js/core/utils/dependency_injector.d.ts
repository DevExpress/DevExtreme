export interface DependencyInjector {
  inject(Object): void;
  resetInjection(): void;
}
