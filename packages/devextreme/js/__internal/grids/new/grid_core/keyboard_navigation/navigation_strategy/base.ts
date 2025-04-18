import type { ActiveItem, BaseFunctionType, NavigationItem } from './types';

export abstract class NavigationStrategyBase {
  protected items: NavigationItem[] = [];

  protected activeIdx = 0;

  public abstract onKeyDown(event: KeyboardEvent): boolean;

  public setItem(idx: number, item: NavigationItem): void {
    this.items[idx] = item;
  }

  public clear(): void {
    this.items = [];
  }

  public normalizeActiveIdx(): void {
    if (!this.items[this.activeIdx]) {
      this.activeIdx = 0;
    }
  }

  public focusActiveItem(): void {
    const activeItem = this.items[this.activeIdx];
    activeItem?.focus();
  }

  public getActiveItem(): ActiveItem | null {
    const activeItem = this.items[this.activeIdx];
    const element = activeItem?.getElement();

    if (!activeItem || !element) {
      return null;
    }

    return { idx: this.activeIdx, element };
  }

  public setActiveItem(idx: number, focus: boolean): void {
    if (!this.items[idx]) {
      return;
    }

    this.activeIdx = idx;

    if (focus) {
      this.focusActiveItem();
    }
  }

  public getNewActiveItem<TAction extends BaseFunctionType>(
    action: () => ReturnType<TAction>,
  ): [ReturnType<TAction>, ActiveItem | null] {
    const prevActiveItem = this.getActiveItem();
    const result = action();
    const nextActiveItem = this.getActiveItem();

    return !!nextActiveItem && prevActiveItem?.element !== nextActiveItem?.element
      ? [result, nextActiveItem]
      : [result, null];
  }
}
