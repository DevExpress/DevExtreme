import {
    SlideToggleContractConfigs,
    SlideToggleContractModels,
    SlideToggleContractTemplates
} from '@devexpress/core/slideToggle';
import { ReactContracts } from '../../../../internal/index';
import { IndicatorViewTemplate, TextViewTemplate } from './templates';

type ReactSlideToggleContracts = ReactContracts<SlideToggleContractModels, SlideToggleContractConfigs, SlideToggleContractTemplates>;

interface DxSlideToggleProps extends ReactSlideToggleContracts {
    indicatorView?: IndicatorViewTemplate;
    textView?: TextViewTemplate;
}

export type { DxSlideToggleProps };
