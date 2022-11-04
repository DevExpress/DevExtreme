import {ComponentContextContainer, ContextCallbacks, createInjectionToken} from '../../internal/index';
import {SlideToggleContractModels, SlideToggleStore} from '@devexpress/core/src/components/slideToggle';

type SlideToggleCallbacks = ContextCallbacks<SlideToggleContractModels>;
type SlideToggleContext = ComponentContextContainer<SlideToggleStore, SlideToggleContractModels>;

const slideToggleContextFactory = (): SlideToggleContext => ({ context: undefined });
const SLIDE_TOGGLE_CONTEXT_TOKEN = createInjectionToken('SLIDE_TOGGLE_TOKEN');


export type {SlideToggleContext, SlideToggleCallbacks};
export {
  slideToggleContextFactory,
  SLIDE_TOGGLE_CONTEXT_TOKEN,
}
