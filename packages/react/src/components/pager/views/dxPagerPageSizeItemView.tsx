import React from 'react';
import { PageSizeItemTemplate, ItemReactVM } from '../types/public/index';

interface DxPagerPageSizeItemViewProps {
    // TODO jQuery: Temporary wrapping for the inferno generator.
    data: {
        item: ItemReactVM<PageSizeItemTemplate>;
        selectPageSize: (pageSize: number) => void;
    }
}

const DxPagerPageSizeItemView = ({
    data: {
        item,
        selectPageSize
    }
}: DxPagerPageSizeItemViewProps) => {
    const clickHandler = () => {
        selectPageSize(item.value);
    };
    return (
        <div key={item.value}
            className={`dx-pager-page-size__item ${item.selected ? '-selected' : ''}`}
            onClick={clickHandler}>
            {item.label}
        </div>
    );
};

export type { DxPagerPageSizeItemViewProps };
export { DxPagerPageSizeItemView };
