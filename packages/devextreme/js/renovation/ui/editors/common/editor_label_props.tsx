import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';
import { isMaterial, current } from '../../../../ui/themes';

@ComponentBindings()
export class EditorLabelProps {
  @OneWay() label?: string = '';

  @OneWay() labelMode?: 'static' | 'floating' | 'hidden' = isMaterial(current()) ? 'floating' : 'static';
}
