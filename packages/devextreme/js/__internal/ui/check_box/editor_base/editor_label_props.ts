import { isMaterial, current } from '@js/ui/themes';
export const EditorLabelProps = {
  label: '',
  get labelMode() {
    return isMaterial(current()) ? 'floating' : 'static';
  }
};
