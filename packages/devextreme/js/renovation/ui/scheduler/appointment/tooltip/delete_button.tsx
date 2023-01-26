import {
  Component, ComponentBindings, JSXComponent, Event,
} from '@devextreme-generator/declarations';
import { Button } from '../../../button';

export const viewFunction = (): JSX.Element => (
  <div className="dx-tooltip-appointment-item-delete-button-container">
    <Button
      className="dx-tooltip-appointment-item-delete-button"
      icon="trash"
      stylingMode="text"
    />
  </div>
);

@ComponentBindings()
export class DeleteButtonProps {
  @Event() onClick?: () => void;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class DeleteButton extends JSXComponent(DeleteButtonProps) {
}
