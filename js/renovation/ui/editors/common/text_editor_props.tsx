import {
  ComponentBindings, OneWay, TwoWay, Event,
} from '@devextreme-generator/declarations';
import { isMaterial, current } from '../../../../ui/themes';
import { EventCallback } from '../../common/event_callback';

@ComponentBindings()
export class TextEditorProps {
  @OneWay() inputAttr?: unknown;

  @OneWay() maxLength?: string | number | null = null;

  @OneWay() spellCheck?: boolean = false;

  @OneWay() valueChangeEvent?: string = 'change';

  @OneWay() stylingMode?: 'outlined' | 'underlined' | 'filled' = isMaterial(current()) ? 'filled' : 'outlined';

  // overrides
  @TwoWay() value = '';

  @Event() valueChange?: EventCallback<string>;
}
