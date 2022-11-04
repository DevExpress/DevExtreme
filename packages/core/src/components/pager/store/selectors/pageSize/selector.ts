import { DeepReadonly } from 'ts-essentials';
import { PagerState, PageSizeState } from '../../state';
import { PageSizeVM } from './types';

function getParams(
    { pageSize }: DeepReadonly<PagerState>
): DeepReadonly<PageSizeState> {
    return pageSize;
}

function pageSizeSelector(
    { selected, sizes, templates }: DeepReadonly<PageSizeState>
): DeepReadonly<PageSizeVM> {
    const result = {
        items: sizes.map((pageSize) => ({
            label: pageSize.toString(),
            value: pageSize,
            selectable: true,
            selected: pageSize === selected,
            template: templates.item
        })),
        template: templates.general
    };

    return result;
}

export type {
    PageSizeVM
};

export {
    getParams,
    pageSizeSelector
};
