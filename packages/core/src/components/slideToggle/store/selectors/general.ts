import { createSelector } from '../../../../internal/index.js';
import { SlideToggleState } from '../state.js';

const SLIDE_TOGGLE_GENERAL_SELECTOR = createSelector<SlideToggleState, SlideToggleState, SlideToggleState>(
    (state) => state,
    (state) => state
);

export { SLIDE_TOGGLE_GENERAL_SELECTOR };
