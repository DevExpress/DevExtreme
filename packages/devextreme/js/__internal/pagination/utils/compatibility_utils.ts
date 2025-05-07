/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable @typescript-eslint/no-unsafe-return */
import messageLocalization from '@js/common/core/localization/message';

import type { PaginationConfigContextValue } from '../common/pagination_config_context';
import { PaginationConfigContext } from '../common/pagination_config_context';

function getPaginationConfig(context): PaginationConfigContextValue {
  if (context[PaginationConfigContext.id]) {
    return context[PaginationConfigContext.id];
  }
  return PaginationConfigContext.defaultValue;
}

export function isGridCompatibilityMode(context): boolean {
  return !!getPaginationConfig(context)?.isGridCompatibilityMode;
}

export function getLocalizationMessage(context, key: string): string {
  let actualKey = key;
  if (isGridCompatibilityMode(context)) {
    actualKey = key.replace('dxPagination', 'dxPager');
  }
  return messageLocalization.getFormatter(actualKey)();
}
