import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';
import { EditorProps as NativeEditorProps } from './internal/editor';
import devices from '../../../core/devices';

@ComponentBindings()
export class EditorProps extends NativeEditorProps {
  @OneWay() hoverStateEnabled = true;

  @OneWay() activeStateEnabled = true;

  @OneWay() focusStateEnabled = devices.real().deviceType === 'desktop' && !devices.isSimulator();
}
