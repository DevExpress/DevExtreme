import { isMaterial, current } from '../../../../ui/themes';
export const EditorLabelProps = {
  label: '',
  get labelMode() {
    return isMaterial(current()) ? 'floating' : 'static';
  }
};
