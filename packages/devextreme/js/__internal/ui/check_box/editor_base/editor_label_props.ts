import { current, isMaterial } from '@js/ui/themes';

export interface EditorLabelProps {
  label?: string;
  labelMode?: 'static' | 'floating' | 'hidden';
}

export const defaultEditorLabelProps: EditorLabelProps = {
  label: '',
  labelMode: isMaterial(current()) ? 'floating' : 'static',
};
