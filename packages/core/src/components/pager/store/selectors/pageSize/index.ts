import { createSelector } from '../../../../../internal/index';
import { getParams, pageSizeSelector } from './selector';

const PAGER_PAGE_SIZE_SELECTOR = createSelector(
    getParams,
    pageSizeSelector
);

export { PAGER_PAGE_SIZE_SELECTOR };
export * from './types';
