import { createSelector } from '../../../../../internal/index';
import { getParams, pageNumberSelector } from './selector';

const PAGER_PAGE_NUMBER_SELECTOR = createSelector(
    getParams,
    pageNumberSelector
);

export { PAGER_PAGE_NUMBER_SELECTOR };
export * from './types';
