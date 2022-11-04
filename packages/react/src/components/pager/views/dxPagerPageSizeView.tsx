import React from 'react';
import { PageSizeReactVM } from '../types/public/index';

interface DxPagerPageSizeViewProps {
    // TODO jQuery: Temporary wrapping for the inferno generator.
    data: {
        viewModel: PageSizeReactVM;
        selectPageSize: (pageSize: number) => void;
    }
}

const DxPagerPageSizeView = ({
    data: {
        viewModel,
        selectPageSize
    }
}: DxPagerPageSizeViewProps) => {
    return (
        <div className="dx-pager-page-size">
            {
                viewModel.items.map((item) =>
                    item.template({
                        data: {
                            item,
                            selectPageSize
                        }
                    }))
            }
        </div>
    );
};

export type { DxPagerPageSizeViewProps };
export { DxPagerPageSizeView };
