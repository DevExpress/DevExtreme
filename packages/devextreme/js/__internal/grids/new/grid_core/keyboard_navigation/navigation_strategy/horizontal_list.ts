import { NavigationStrategyBase } from './base';

export class NavigationStrategyHorizontalList
  extends NavigationStrategyBase {
  public onKeyDown(event: KeyboardEvent): boolean {
    switch (event.key) {
      case 'ArrowLeft':
        this.moveActiveElement(-1);
        return true;
      case 'ArrowRight':
        this.moveActiveElement(1);
        return true;
      default:
        return false;
    }
  }

  private moveActiveElement(idxShift: number): void {
    const currentIdx = this.activeIdx;

    if (currentIdx < 0) {
      this.focusActiveItem();
      return;
    }

    const nextIdx = currentIdx + idxShift;
    this.setActiveItem(nextIdx, true);
  }
}
