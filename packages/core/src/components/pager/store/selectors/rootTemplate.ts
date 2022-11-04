import { createSelector } from '../../../../internal/index';
import { PagerState } from '../state';

const PAGER_ROOT_TEMPLATE_SELECTOR = createSelector<PagerState, unknown, unknown>(
    (state) => state.pagerTemplate,
    (rootTemplate) => ({ template: rootTemplate })
);

export { PAGER_ROOT_TEMPLATE_SELECTOR };
