import React from 'react';
import {
    UpdateFromContractsAction
} from '@devexpress/core/slideToggle';
import { useSecondEffect } from '../../internal/index';
import { DxSlideToggleContainer } from './containers/dxSlideToggleContainer';
import { SlideToggleContext } from './dxSlideToggleContext';
import { useCoreContext, useIsControlled } from './hooks/index';
import { propsToContracts } from './utils/index';
import { DxSlideToggleProps } from './types/public/index';

// TODO jQuery: export here for the inferno generator.
export const DxSlideToggle = React.memo((props: DxSlideToggleProps) => {
    const isControlled = useIsControlled(props);
    const [store, context] = useCoreContext(props, isControlled);

    /* update state from contracts */
    const contracts = propsToContracts(props, false, isControlled);
    useSecondEffect(() => {
        store.dispatch(new UpdateFromContractsAction(contracts));
    }, [contracts]);

    return (
        <SlideToggleContext.Provider value={context}>
            <DxSlideToggleContainer/>
        </SlideToggleContext.Provider>
    );
});
