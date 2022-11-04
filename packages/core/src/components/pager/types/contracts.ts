/* page number */
export interface PageNumberContractModels {
    selectedPage: number;
}

export interface PageNumberContractConfigs {
    pageCount: number;
}

export interface PageNumberContractTemplates {
    pageNumberView: unknown;
    pageNumberItemView: unknown;
    pageNumberFakeItemView: unknown;
}

export interface PageNumberContracts
    extends PageNumberContractModels, PageNumberContractConfigs, PageNumberContractTemplates {
}

/* page size */
export interface PageSizeContractModels {
    selectedPageSize: number;
}

export interface PageSizeContractConfigs {
    pageSizes: number[];
}

export interface PageSizeContractTemplates {
    pageSizeView: unknown;
    pageSizeItemView: unknown;
}

export interface PageSizeContracts
    extends PageSizeContractModels, PageSizeContractConfigs, PageSizeContractTemplates {
}

/* general */
export interface PagerContractModels extends PageNumberContractModels, PageSizeContractModels {
}

export interface PagerContractConfigs extends PageNumberContractConfigs, PageSizeContractConfigs {
}

export interface PagerContractTemplates extends PageNumberContractTemplates, PageSizeContractTemplates {
    pagerView: unknown;
}

export interface PagerContracts
    extends PagerContractModels, PagerContractConfigs, PagerContractTemplates {
}
