import React from 'react';
import { PageNumberReactVM } from '../types/public/index';

interface DxPagerPageNumberViewProps {
    // TODO jQuery: Temporary wrapping for the inferno generator.
    data: {
        viewModel: PageNumberReactVM;
        selectPage: (pageNumber: number) => void;
    }
}

const DxPagerPageNumberView = ({
    data: {
        viewModel,
        selectPage
    }
}: DxPagerPageNumberViewProps) => {
    return (
        <div className="dx-pager-pages">
            {
                viewModel.items.map((item) =>
                    item.template({
                        data: {
                            item,
                            selectPage
                        }
                    })
                )
            }
        </div>
    );
};

export type { DxPagerPageNumberViewProps };
export { DxPagerPageNumberView };
