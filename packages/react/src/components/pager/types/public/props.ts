import { PagerContractModels, PagerContractConfigs, PagerContractTemplates } from '@devexpress/core/pager';
import { ReactContracts } from '../../../../internal/index';
import {
    PageNumberItemTemplate,
    PageNumberTemplate,
    PagerTemplate,
    PageSizeItemTemplate,
    PageSizeTemplate
} from './templates';

type ReactPagerContracts = ReactContracts<PagerContractModels, PagerContractConfigs, PagerContractTemplates>;

interface DxPagerProps extends ReactPagerContracts {
    pagerView?: PagerTemplate;
    pageNumberView?: PageNumberTemplate;
    pageNumberItemView?: PageNumberItemTemplate;
    pageNumberFakeItemView?: PageNumberItemTemplate;
    pageSizeView?: PageSizeTemplate;
    pageSizeItemView?: PageSizeItemTemplate;
}

export type { DxPagerProps };
