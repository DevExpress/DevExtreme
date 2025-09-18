/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import type { ButtonGroupBase } from '../button_group.widget';
import type { Constructor } from '../types';

export function PublicMethods<TBase extends Constructor<ButtonGroupBase>>(ButtonGroupCore: TBase) {
  return class ButtonGroupWithFunctionality extends ButtonGroupCore {
    public testMethod(): void {
      console.warn('hello from public method');
    }

    public addItem(item: unknown): void {
      this.functionalityController.addItem(item);
    }

    public selectItem(itemIndex: number): void {
      this.functionalityController.selectItem(itemIndex);
    }

    public deselectItem(itemIndex: number): void {
      this.functionalityController.deselectItem(itemIndex);
    }

    public getSelectedItems(): unknown[] {
      return this.functionalityController.getSelectedItems();
    }

    public getSelectedItemKeys(): unknown[] {
      return this.functionalityController.getSelectedItemKeys();
    }

    public clearSelection(): void {
      this.functionalityController.clearSelection();
    }

    public isItemSelected(itemIndex: number): boolean {
      return this.functionalityController.isItemSelected(itemIndex);
    }
  };
}
