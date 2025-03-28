import type { NativeEventInfo } from '@js/events';
import type { TextBoxInstance } from '@js/ui/text_box';

import { TextBox } from '../inferno_wrappers/textbox';
import { addWidgetPrefix } from '../utils';

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

export function SearchField(props: SearchFieldProps): JSX.Element | null {
  const {
    value, placeholder, width,
  } = props;
  // eslint-disable-next-line @typescript-eslint/init-declarations
  let timer;
  const onInput = (e: NativeEventInfo<TextBoxInstance, UIEvent>): void => {
    clearTimeout(timer);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const component = e.component as any;
    const newValue = component._input().val();
    timer = setTimeout(() => {
      props.onValueChanged?.(newValue);
    }, FILTERING_TIMEOUT);
  };

  return (
    <div class={addWidgetPrefix(CLASS.searchPanel)}>
      <TextBox
        value={value}
        placeholder={placeholder}
        width={width}
        onInput={onInput}
      />
    </div>
  );
}
