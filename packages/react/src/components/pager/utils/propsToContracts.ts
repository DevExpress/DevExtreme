import { DeepPartial } from 'ts-essentials';
import {
    PageNumberContracts,
    PagerContracts,
    PageSizeContracts,
    PageNumberContractModels,
    PageSizeContractModels
} from '@devexpress/core/pager';
import { DxPagerProps } from '../types/public/index';
import { PAGER_DEFAULT_VIEWS } from '../views/defaultViews';

const getPageNumberModels = (
    props: DxPagerProps,
    initState: boolean,
    isControlled: boolean
): DeepPartial<PageNumberContractModels> => {
    switch (true) {
        case isControlled:
            return { selectedPage: props.selectedPage };
        case !isControlled && initState:
            return { selectedPage: props.defaultSelectedPage };
        default:
            return {};
    }
};

const pageNumberPropsToContracts = (
    props: DxPagerProps,
    initState: boolean,
    isControlled: boolean
): DeepPartial<PageNumberContracts> => ({
    ...getPageNumberModels(props, initState, isControlled),
    pageCount: props.pageCount,
    pageNumberView: props.pageNumberView || PAGER_DEFAULT_VIEWS.pageNumberView,
    pageNumberItemView: props.pageNumberItemView || PAGER_DEFAULT_VIEWS.pageNumberItemView,
    pageNumberFakeItemView: props.pageNumberFakeItemView || PAGER_DEFAULT_VIEWS.pageNumberFakeItemView
});

const getPageSizeModels = (
    props: DxPagerProps,
    initState: boolean,
    isControlled: boolean
): DeepPartial<PageSizeContractModels> => {
    switch (true) {
        case isControlled:
            return { selectedPageSize: props.selectedPageSize };
        case !isControlled && initState:
            return { selectedPageSize: props.defaultSelectedPageSize };
        default:
            return {};
    }
};

const pageSizePropsToContracts = (
    props: DxPagerProps,
    initState: boolean,
    isControlled: boolean
): DeepPartial<PageSizeContracts> => ({
    ...getPageSizeModels(props, initState, isControlled),
    pageSizes: props.pageSizes,
    pageSizeView: props.pageSizeView || PAGER_DEFAULT_VIEWS.pageSizeView,
    pageSizeItemView: props.pageSizeItemView || PAGER_DEFAULT_VIEWS.pageSizeItemView
});

const propsToContracts = (
    props: DxPagerProps,
    initState: boolean,
    isControlled: boolean
): DeepPartial<PagerContracts> => ({
    ...pageNumberPropsToContracts(props, initState, isControlled),
    ...pageSizePropsToContracts(props, initState, isControlled),
    pagerView: props.pagerView || PAGER_DEFAULT_VIEWS.pagerView
});

export { propsToContracts };
