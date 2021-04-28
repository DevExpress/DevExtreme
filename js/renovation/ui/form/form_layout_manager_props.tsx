import { ComponentBindings, Event, OneWay } from '@devextreme-generator/declarations';
import { OnEditorEnterKeyCallback, OnFieldDataChangedCallback, LabelLocation } from './types';

@ComponentBindings()
export class FormLayoutManagerProps {
  @OneWay() isRoot = false;

  @OneWay() layoutData: any = {};

  @OneWay() readOnly = false;

  @OneWay() labelLocation: LabelLocation = 'left';

  @Event() onFieldDataChanged?: OnFieldDataChangedCallback;

  @Event() onEditorEnterKey?: OnEditorEnterKeyCallback;

  @Event() customizeItem?: (item: any) => void;

  @OneWay() minColWidth = 200;

  @OneWay() showRequiredMark = true;

  @OneWay() showOptionalMark = false;

  @OneWay() requiredMark = '*';

  @OneWay() optionalMark?: string;

  @OneWay() requiredMessage?: () => string;
}
