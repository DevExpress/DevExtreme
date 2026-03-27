import { FilterCellModel } from '../cell/filter_cell';
import { BaseRowModel } from './base_row';

export class FilterRowModel extends BaseRowModel {
  public getFilterCell(columnIndex: number): FilterCellModel {
    return new FilterCellModel(this.getCell(columnIndex));
  }
}
