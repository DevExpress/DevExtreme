import {
  ComponentBindings, OneWay,
} from '@devextreme-generator/declarations';
import devices from '../../../../common/core/environment/devices';

@ComponentBindings()
export class EditorStateProps {
  @OneWay() hoverStateEnabled = true;

  @OneWay() activeStateEnabled = true;

  @OneWay() focusStateEnabled = devices.real().deviceType === 'desktop' && !devices.isSimulator();
}
