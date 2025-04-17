import { NavigationStrategyBase } from './base';

export class NavigationStrategyMatrix
  extends NavigationStrategyBase {
  constructor(
    private columnsCount: number,
  ) {
    super();
  }

  public updateColumnsCount(columnsCount: number): void {
    this.columnsCount = columnsCount;
  }

  public onKeyDown(event: KeyboardEvent): boolean {
    return this.activeIdx >= 0
      ? this.handleMovement(event)
      : false;
  }

  private handleMovement(event: KeyboardEvent): boolean {
    switch (true) {
      case event.key === 'ArrowUp':
        this.moveActiveElement(-1, 0);
        return true;
      case event.key === 'ArrowDown':
        this.moveActiveElement(1, 0);
        return true;
      case event.key === 'ArrowLeft':
        this.moveActiveElement(0, -1);
        return true;
      case event.key === 'ArrowRight':
        this.moveActiveElement(0, 1);
        return true;
      case event.ctrlKey && event.key === 'Home':
        this.moveToFirstInFirstRow();
        return true;
      case event.key === 'Home':
        this.moveToFirstInRow();
        return true;
      case event.ctrlKey && event.key === 'End':
        this.moveToLastInLastRow();
        return true;
      case event.key === 'End':
        this.moveToLastInRow();
        return true;
      default:
        return false;
    }
  }

  private moveActiveElement(
    rowShift: number,
    columnShift: number,
  ): void {
    const currentIdx = this.activeIdx;
    const { columnsCount, items: { length: itemsCount } } = this;
    const rowCount = Math.ceil(itemsCount / columnsCount);
    const currentColumnIdx = currentIdx % columnsCount;
    const currentRowIdx = Math.floor(currentIdx / columnsCount);
    const nextColumnIdx = currentColumnIdx + columnShift;
    const nextRowIdx = currentRowIdx + rowShift;
    const nextIdx = currentIdx + columnShift + columnsCount * rowShift;

    if (
      nextIdx >= itemsCount
      || nextColumnIdx < 0
      || nextColumnIdx >= columnsCount
      || nextRowIdx < 0
      || nextRowIdx >= rowCount
    ) {
      this.focusActiveItem();
      return;
    }

    this.setActiveItem(nextIdx, true);
  }

  private moveToFirstInRow(): void {
    const currentIdx = this.activeIdx;
    const { columnsCount } = this;
    const currentColumnIdx = currentIdx % columnsCount;

    if (currentColumnIdx === 0) {
      return;
    }

    this.moveActiveElement(0, -currentColumnIdx);
  }

  private moveToLastInRow(): void {
    const currentIdx = this.activeIdx;
    const { columnsCount } = this;
    const currentColumnIdx = currentIdx % columnsCount;

    if (currentColumnIdx === (columnsCount - 1)) {
      return;
    }

    this.moveActiveElement(0, columnsCount - currentColumnIdx - 1);
  }

  private moveToFirstInFirstRow(): void {
    this.setActiveItem(0, true);
  }

  private moveToLastInLastRow(): void {
    const { items: { length: itemsCount } } = this;
    this.setActiveItem(itemsCount - 1, true);
  }
}
