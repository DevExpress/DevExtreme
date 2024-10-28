import { isMaterial, current } from '@js/ui/themes';
export const TextEditorProps = {
  maxLength: null,
  spellCheck: false,
  valueChangeEvent: 'change',
  get stylingMode() {
    return isMaterial(current()) ? 'filled' : 'outlined';
  },
  defaultValue: ''
};
