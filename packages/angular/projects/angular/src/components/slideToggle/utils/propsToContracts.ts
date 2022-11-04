import {SlideToggleContracts} from '@devexpress/core/src/components/slideToggle';
import {DeepPartial} from 'ts-essentials';
import {DxSlideToggleComponent} from '../dx-slide-toggle.component';
import {SLIDE_TOGGLE_DEFAULT_VIEWS} from '../views/index';

const propsToContracts = (
  component: DxSlideToggleComponent,
): DeepPartial<SlideToggleContracts> => {
  return {
    value: component.value,
    text: component.text,
    textPosition: component.textPosition,
    indicatorView: component.indicatorView || SLIDE_TOGGLE_DEFAULT_VIEWS.indicatorView,
    textView: component.textView || SLIDE_TOGGLE_DEFAULT_VIEWS.textView,
  }
}

export {propsToContracts};
