interface PageNumberTemplateState {
    general: unknown;
    item: unknown;
    fakeItem: unknown;
}

interface PageNumberState {
    selected: number;
    count: number;
    templates: PageNumberTemplateState;
}

interface PageSizeTemplateState {
    general: unknown;
    item: unknown;
}

interface PageSizeState {
    selected: number;
    sizes: number[];
    templates: PageSizeTemplateState;
}

interface PagerState {
    pageNumber: PageNumberState;
    pageSize: PageSizeState;
    pagerTemplate: unknown;
}

const PAGER_DEFAULT_PAGE_SIZES = [20, 40];
const PAGER_DEFAULT_STATE: PagerState = {
    pageNumber: {
        selected: 1,
        count: 1,
        templates: {
            general: undefined,
            item: undefined,
            fakeItem: undefined
        }
    },
    pageSize: {
        selected: PAGER_DEFAULT_PAGE_SIZES[0],
        sizes: PAGER_DEFAULT_PAGE_SIZES,
        templates: {
            general: undefined,
            item: undefined
        }
    },
    pagerTemplate: undefined
};

export type {
    PageSizeState,
    PageNumberState,
    PagerState,
    PageNumberTemplateState,
    PageSizeTemplateState
};

export {
    PAGER_DEFAULT_PAGE_SIZES,
    PAGER_DEFAULT_STATE
};
