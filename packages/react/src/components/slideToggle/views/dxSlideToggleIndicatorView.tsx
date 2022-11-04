import React from 'react';
import { TTextPosition } from '@devexpress/core/slideToggle';

import './dxSlideToggleIndicatorView.scss';

interface DxSlideToggleIndicatorViewProps {
    // TODO jQuery: Temporary wrapping for the inferno generator.
    data: {
        value: boolean;
        textPosition: TTextPosition;
    }
}

const DxSlideToggleIndicatorView = ({
    data: {
        value,
        textPosition
    }
}: DxSlideToggleIndicatorViewProps) => {
    return (
        <div
            className={`dx-slide-toggle-indicator ${textPosition === 'right' ? '-left' : '-right'}`}>
            <div className={`dx-slide-toggle-line ${!value ? '-off' : '-on'}`}>
                <div className={`dx-slide-toggle-thumb ${!value ? '-off' : '-on'}`}>
                </div>
            </div>
        </div>
    );
};

export type { DxSlideToggleIndicatorViewProps };
export { DxSlideToggleIndicatorView };
