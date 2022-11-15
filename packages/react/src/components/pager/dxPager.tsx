import React from 'react';
import {
    UpdateFromContractsAction
} from '@devexpress/core/pager';
import { useSecondEffect } from '../../internal/index';
import { useIsControlled, useCoreControlledContext, useCoreUncontrolledContext } from './hooks/index';
import { DxPagerProps } from './types/public/index';
import {
    propsToContracts
} from './utils/index';
import { PagerContext } from './dxPagerContext';
import { DxPagerContainer } from './containers/dxPagerContainer';

import './dxPager.scss';

// TODO jQuery: export here for the inferno generator.
// TODO Vitik: React.memo isn't implemented for 'inferno'
// export const DxPager = React.memo(
// TODO Vitik: export 'const DxPager = ...' isn't supported by generator
//* Component={"name":"DxPager", "jQueryRegistered":true, "hasApiMethod":false}
export function DxPager(props: DxPagerProps) {
    const isControlled = useIsControlled(props);
    const [store, context] = isControlled
        ? useCoreControlledContext(props)
        : useCoreUncontrolledContext(props);

    /* update from contracts */
    const contracts = propsToContracts(props, false, isControlled);
    useSecondEffect(() => {
        store.dispatch(new UpdateFromContractsAction(contracts));
    }, [props]);

    return (
        <PagerContext.Provider value={context}>
            <DxPagerContainer/>
        </PagerContext.Provider>
    );
}

// );

// TODO Vitik: required for component wrapper
DxPager.defaultProps = {
    selectedPage: 1,
    selectedPageSize: 10,
    pageCount: 20,
    pageSizes: [10, 20, 30]
};
