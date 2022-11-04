import React from 'react';
import { PageNumberReactVM, PageSizeReactVM } from '../types/public/index';

interface DxPagerViewProps {
    // TODO jQuery: Temporary wrapping for the inferno generator.
    data: {
        pageSizeViewModel: PageSizeReactVM;
        pageNumberViewModel: PageNumberReactVM;
        selectedPageChange: (pageNumber: number) => void;
        selectedPageSizeChange: (pageSize: number) => void;
    }
}

const DxPagerView = (props: DxPagerViewProps) => {
    const pageSizeView = props.data.pageSizeViewModel.template;
    const pageNumberView = props.data.pageNumberViewModel.template;

    return (
        <div className="dx-pager">
            {
                pageSizeView({
                    data: {
                        viewModel: props.data.pageSizeViewModel,
                        selectPageSize: props.data.selectedPageSizeChange
                    }
                })
            }
            {
                pageNumberView({
                    data: {
                        viewModel: props.data.pageNumberViewModel,
                        selectPage: props.data.selectedPageChange
                    }
                })
            }
        </div>
    );
};

export type { DxPagerViewProps };
export { DxPagerView };
