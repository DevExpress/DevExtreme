import { current, isMaterial } from '../../../../ui/themes';

export interface EditorLabelProps {
  label?: string;
  labelMode?: 'static' | 'floating' | 'hidden';
}

export const EditorLabelDefaultProps: EditorLabelProps = {
  label: '',
  labelMode: isMaterial(current()) ? 'floating' : 'static',
};
