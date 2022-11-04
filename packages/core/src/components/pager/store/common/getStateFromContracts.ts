import { DeepPartial, DeepReadonly } from 'ts-essentials';
import { PageNumberContracts, PagerContracts, PageSizeContracts } from '../../types/index';
import { PagerState } from '../state';

const getPageNumberStateFromContracts = (
    state: DeepReadonly<PagerState>,
    contracts: DeepPartial<PageNumberContracts>
): DeepReadonly<Partial<PagerState>> => ({
    pageNumber: {
        count: contracts.pageCount ?? state.pageNumber.count,
        selected: contracts.selectedPage ?? state.pageNumber.selected,
        templates: {
            general: contracts.pageNumberView ?? state.pageNumber.templates.general,
            item: contracts.pageNumberItemView ?? state.pageNumber.templates.item,
            fakeItem: contracts.pageNumberFakeItemView ?? state.pageNumber.templates.fakeItem
        }
    }
});

const getPageSizeStateFromContracts = (
    state: DeepReadonly<PagerState>,
    contracts: DeepPartial<PageSizeContracts>
): DeepReadonly<Partial<PagerState>> => ({
    pageSize: {
        // TODO: Check DeepPartial in this case.
        sizes: (contracts.pageSizes as number[] | undefined) ?? state.pageSize.sizes,
        selected: contracts.selectedPageSize ?? state.pageSize.selected,
        templates: {
            general: contracts.pageSizeView ?? state.pageSize.templates.general,
            item: contracts.pageSizeItemView ?? state.pageSize.templates.item
        }
    }
});

const getStateFromContracts = (
    state: DeepReadonly<PagerState>,
    contracts: DeepPartial<PagerContracts>
): DeepReadonly<PagerState> => ({
    ...state,
    ...getPageNumberStateFromContracts(state, contracts),
    ...getPageSizeStateFromContracts(state, contracts),
    pagerTemplate: contracts.pagerView ?? state.pagerTemplate
});

export {
    getPageNumberStateFromContracts,
    getPageSizeStateFromContracts,
    getStateFromContracts
};
