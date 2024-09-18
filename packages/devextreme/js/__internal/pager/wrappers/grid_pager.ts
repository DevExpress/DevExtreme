/* eslint-disable @typescript-eslint/ban-types */
import { ComponentWrapper } from '../../core/r1/component_wrapper';
import type { Option } from '../../core/r1/types';

export class GridPagerWrapper extends ComponentWrapper {
  _optionChanged(args: Option): void {
    switch (args.name) {
      case 'pageIndex': {
        const pageIndexChanged = this.option('pageIndexChanged') as Function;
        if (pageIndexChanged) {
          pageIndexChanged(args.value);
        }
        break;
      }
      case 'pageSize': {
        const pageSizeChanged = this.option('pageSizeChanged') as Function;
        if (pageSizeChanged) {
          pageSizeChanged(args.value);
        }
        break;
      }
      default: break;
    }
    super._optionChanged(args);
  }

  _validateOptions(options: Record<string, unknown>): Record<string, unknown> {
    const initialOptions = super._validateOptions(options);
    let {
      pageSize,
      pageIndex,
      totalCount,
      // eslint-disable-next-line prefer-const
      ...rest
    } = initialOptions;

    if (pageSize === undefined) {
      pageSize = this.option('pageSize') as number;
    }

    if (pageIndex === undefined) {
      pageIndex = this.option('pageIndex') as number;
    }

    if (totalCount === undefined) {
      totalCount = this.option('totalCount') as number;
    }

    const validatedOptions = this._validateOptionsCore(
      pageSize as number,
      pageIndex as number,
      totalCount as number,
    );

    return {
      ...rest,
      ...validatedOptions,
    };
  }

  _validateOptionsCore(
    pageSize: number,
    oldPageIndex: number,
    oldItemCount: number,
  ): Record<string, number> {
    const itemCount = this.getItemCount(oldItemCount);
    const pageCount = this.getPageCount(pageSize, oldItemCount);
    const pageIndex = this.getPageIndex(oldPageIndex, pageSize, itemCount);

    return {
      pageSize,
      pageIndex,
      totalCount: itemCount,
      pageCount,
    };
  }

  private getItemCount(itemCount: number): number {
    if (itemCount < 1) {
      return 1;
    }
    return itemCount;
  }

  private getPageCount(pageSize: number, itemCount: number): number {
    if (pageSize > 0 && itemCount > 0) {
      return Math.max(1, Math.ceil(itemCount / pageSize));
    }
    return 1;
  }

  private getPageIndex(pageIndex: number, pageSize: number, itemCount: number): number {
    if (pageIndex < 1) {
      return 1;
    }

    const pageCount = this.getPageCount(pageSize, itemCount);
    return Math.min(pageIndex, pageCount);
  }
}
