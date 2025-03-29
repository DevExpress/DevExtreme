import type { NativeEventInfo } from '@js/events';
import messageLocalization from '@js/localization/message';
import type { TextBoxInstance } from '@js/ui/text_box';
import { Component } from 'inferno';

import { TextBox } from '../inferno_wrappers/textbox';
import { addWidgetPrefix, getName } from '../utils';

const FILTERING_TIMEOUT = 700;

const CLASS = {
  searchPanel: 'search-panel',
};
export interface SearchFieldProps {
  value?: string;
  placeholder?: string;
  width?: string | number;
  onValueChanged?: (v: string) => void;
}

export class SearchField extends Component<SearchFieldProps> {
  public render(): JSX.Element {
    // eslint-disable-next-line @typescript-eslint/init-declarations
    let timer;
    const onInput = (e: NativeEventInfo<TextBoxInstance, UIEvent>): void => {
      clearTimeout(timer);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const component = e.component as any;
      const newValue = component._input().val();
      timer = setTimeout(() => {
        this.props.onValueChanged?.(newValue);
      }, FILTERING_TIMEOUT);
    };

    return <div class={addWidgetPrefix(CLASS.searchPanel)}>
      <TextBox
        value={this.props.value}
        placeholder={this.props.placeholder}
        width={this.props.width}
        onInput={onInput}
        inputAttr={{
          'aria-label': messageLocalization.format(`${getName()}-ariaSearchInGrid`),
        }}
      />
    </div>;
  }
}
