import React from 'react';
import { PageNumberItemTemplate, ItemReactVM } from '../types/public/index';

interface DxPagerPageNumberItemViewProps {
    // TODO jQuery: Temporary wrapping for the inferno generator.
    data: {
        item: ItemReactVM<PageNumberItemTemplate>;
        selectPage: (pageNumber: number) => void;
    }
}

const DxPagerPageNumberItemView = ({
    data: {
        item,
        selectPage
    }
}: DxPagerPageNumberItemViewProps) => {
    const clickHandler = () => selectPage(item.value);
    return (
        <div key={item.value}
            className={`dx-pager-pages__item
                        ${item.selectable ? '-selectable' : ''}
                        ${item.selected ? '-selected' : ''}`}
            onClick={clickHandler}>
            {item.label}
        </div>
    );
};

export type { DxPagerPageNumberItemViewProps };
export { DxPagerPageNumberItemView };
