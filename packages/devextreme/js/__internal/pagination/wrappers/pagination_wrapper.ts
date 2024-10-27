/* eslint-disable @typescript-eslint/ban-types */
import { ComponentWrapper } from '../../core/r1/component_wrapper';
import type { Option } from '../../core/r1/types';
import { validateOptions } from '../utils/validation_utils';

export class PaginationWrapper extends ComponentWrapper {
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

  public getPageCount(): number {
    return this.option('pageCount') as number;
  }

  _validateOptions(options: Record<string, unknown>): Record<string, unknown> {
    if (options._skipValidation || this.option('_skipValidation')) {
      return options;
    }

    const initialOptions = super._validateOptions(options);
    let {
      pageSize,
      pageIndex,
      itemCount,
      // eslint-disable-next-line prefer-const
      ...rest
    } = initialOptions;

    if (pageSize === undefined) {
      pageSize = this.option('pageSize') as number;
    }

    if (pageIndex === undefined) {
      pageIndex = this.option('pageIndex') as number;
    }

    if (itemCount === undefined) {
      itemCount = this.option('itemCount') as number;
    }

    const validatedOptions = validateOptions(
      pageSize as number,
      pageIndex as number,
      itemCount as number,
    );

    return {
      ...rest,
      ...validatedOptions,
    };
  }
}
