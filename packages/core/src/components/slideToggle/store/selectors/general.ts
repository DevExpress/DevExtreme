import { createSelector } from '../../../../internal/index';
import { SlideToggleState } from '../state';

const SLIDE_TOGGLE_GENERAL_SELECTOR = createSelector<SlideToggleState, SlideToggleState, SlideToggleState>(
    (state) => state,
    (state) => state
);

export { SLIDE_TOGGLE_GENERAL_SELECTOR };
