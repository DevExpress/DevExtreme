import React, { useCallback, useContext } from 'react';
import { SLIDE_TOGGLE_GENERAL_SELECTOR } from '@devexpress/core/slideToggle';

import './dxSlideToggleContainer.scss';
import { useSelector } from '../../../internal/index';
import { SlideToggleContext } from '../dxSlideToggleContext';
import { IndicatorViewTemplate, TextViewTemplate } from '../types/public/index';

const DxSlideToggleContainer = React.memo(() => {
    const [store, callbacks] = useContext(SlideToggleContext)!;
    const viewModel = useSelector(store, SLIDE_TOGGLE_GENERAL_SELECTOR);

    const updateValueCallback = useCallback(
        () => callbacks.valueChange(!viewModel.model.value),
        [viewModel.model.value]);

    // TODO: Think about how to save a template types without casting from the unknown.
    const indicatorView = viewModel.template.indicatorView as IndicatorViewTemplate;
    const textView = viewModel.template.textView as TextViewTemplate;

    return (
        <div
            className={`dx-slide-toggle ${viewModel.config.textPosition === 'left' ? '-left' : '-right'}`}
            onClick={updateValueCallback}>
            {
                indicatorView({
                    data: {
                        value: viewModel.model.value,
                        textPosition: viewModel.config.textPosition
                    }
                })
            }
            {
                textView({ data: { text: viewModel.config.text } })
            }
        </div>
    );
});

export { DxSlideToggleContainer };
