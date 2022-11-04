import { DeepReadonly } from 'ts-essentials';
import { PageNumberState, PagerState } from '../../state';
import { ItemVM } from '../common/index';
import { VISIBLE_PAGE_COUNT } from './consts';
import { PageNumberVM } from './types';
import {
    getPageItemsVmEnd, getPageItemsVmMiddle, getPageItemsVmShort, getPageItemsVmStart
} from './utils';

function getParams(
    { pageNumber }: DeepReadonly<PagerState>
): DeepReadonly<PageNumberState> {
    return pageNumber;
}

function pageNumberSelector(
    { selected, count, templates }: DeepReadonly<PageNumberState>
): DeepReadonly<PageNumberVM> {
    let items: ItemVM[];
    if (count <= 2 * VISIBLE_PAGE_COUNT + 1) {
        items = getPageItemsVmShort(selected, count, templates.item);
    } else if (selected <= 2 * VISIBLE_PAGE_COUNT) {
        items = getPageItemsVmStart(selected, count, templates.item, templates.fakeItem);
    } else if (selected > count - 2 * VISIBLE_PAGE_COUNT) {
        items = getPageItemsVmEnd(selected, count, templates.item, templates.fakeItem);
    } else {
        items = getPageItemsVmMiddle(selected, count, templates.item, templates.fakeItem);
    }

    return {
        items,
        template: templates.general
    };
}

export {
    getParams,
    pageNumberSelector
};
