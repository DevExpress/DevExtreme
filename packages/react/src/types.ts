import { ReadonlyProps, TemplateProps, ValueProps } from '@devextreme/components';
import { Props } from './internal/props';

export interface EditorProps<T> extends Props<ValueProps<T>, ReadonlyProps, TemplateProps> {
  name?: string
}
