import React, { useContext } from 'react';
import {
    PAGER_PAGE_NUMBER_SELECTOR,
    PAGER_PAGE_SIZE_SELECTOR,
    PAGER_ROOT_TEMPLATE_SELECTOR
} from '@devexpress/core/pager';
import { useSelector } from '../../../internal/index';
import { PagerContext } from '../dxPagerContext';
import { PagerTemplate, PageNumberReactVM, PageSizeReactVM } from '../types/public/index';

//* Component={"name":"DxPagerContainer"}
// TODO inferno isn't support React.memo(
export function DxPagerContainer() {
    const [store, callbacks] = useContext(PagerContext)!;
    // TODO: Think how these ugly casts can be removed (template from the unknown problem).
    const pageNumberViewModel = useSelector(store, PAGER_PAGE_NUMBER_SELECTOR) as PageNumberReactVM;
    const pageSizeViewModel = useSelector(store, PAGER_PAGE_SIZE_SELECTOR) as PageSizeReactVM;
    const { template } = useSelector(store, PAGER_ROOT_TEMPLATE_SELECTOR) as { template: PagerTemplate };

    const templateData = {
        data: {
            pageNumberViewModel,
            pageSizeViewModel,
            ...callbacks
        }
    };

    return (
        template(templateData)
    );
}

//);
