import { TTextPosition } from '../types/index';

interface SlideToggleStateModel {
    value: boolean;
}

interface SlideToggleStateConfig {
    text: string;
    textPosition: TTextPosition;
}

interface SlideToggleStateTemplate {
    indicatorView: unknown,
    textView: unknown,
}

interface SlideToggleState {
    model: SlideToggleStateModel;
    config: SlideToggleStateConfig;
    template: SlideToggleStateTemplate;
}

const SLIDE_TOGGLE_DEFAULT_STATE: SlideToggleState = {
    model: {
        value: false
    },
    config: {
        text: '',
        textPosition: 'right'
    },
    template: {
        indicatorView: null,
        textView: null
    }
};

export type {
    SlideToggleStateModel,
    SlideToggleStateConfig,
    SlideToggleStateTemplate,
    SlideToggleState
};
export { SLIDE_TOGGLE_DEFAULT_STATE };
