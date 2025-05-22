import type { Column } from '../../columns_controller/types';
import { FilterController } from '../filter_controller';
import { HeaderFilterViewController } from './view_controller';

export class CompatibilityHeaderFilterController {
  public static dependencies = [
    FilterController,
    HeaderFilterViewController,
  ] as const;

  constructor(
    private readonly realFilterController: FilterController,
    private readonly realHeaderFilterViewController: HeaderFilterViewController,
  ) {}

  public getCustomFilterOperations(): unknown[] {
    return this.realFilterController.customOperations.peek();
  }

  public showHeaderFilterMenuBase(args: {
    columnElement: Element;
    column: Column;
    onHidden?: () => void;
    customApply?: (filterValues) => void;
    isFilterBuilder?: boolean;
  }): void {
    this.realHeaderFilterViewController.openPopup(
      args.columnElement,
      args.column,
      args.onHidden,
      args.customApply,
      args.isFilterBuilder,
    );
  }

  public hideHeaderFilterMenu(): void {
    this.realHeaderFilterViewController.closePopup();
  }
}
