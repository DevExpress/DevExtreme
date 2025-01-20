import type { Properties as PaginationProperties } from '@js/ui/pagination';
import dxPagination from '@js/ui/pagination';

import { InfernoWrapper } from './widget_wrapper';

export class Pager extends InfernoWrapper<PaginationProperties, dxPagination> {
  protected getComponentFabric(): typeof dxPagination {
    return dxPagination;
  }
}
