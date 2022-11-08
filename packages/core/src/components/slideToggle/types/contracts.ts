import { TTextPosition } from './index';

/* models */
export interface SlideToggleContractModels {
    value: boolean;
}

/* configs */
export interface SlideToggleContractConfigs {
    text: string;
    textPosition: TTextPosition;
}

/* templates */
export interface SlideToggleContractTemplates {
    indicatorView: unknown;
    textView: unknown;
}

export interface SlideToggleContracts
    extends SlideToggleContractModels, SlideToggleContractConfigs, SlideToggleContractTemplates {
}
