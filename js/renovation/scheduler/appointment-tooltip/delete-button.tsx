import {
  Component, JSXComponent, ComponentBindings, Event,
} from 'devextreme-generator/component_declaration/common';
import Button from '../../button';
import {
  TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON, TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER,
} from './consts';

export const viewFunction = (viewModel: DeleteButton) => (
  <div
    className={TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON_CONTAINER}
    // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  >
    <Button
      className={TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON}
      icon="trash"
      stylingMode="text"
      onClick={viewModel.props.onClick}
    />
  </div>
);

@ComponentBindings()
export class DeleteButtonProps {
  @Event() onClick?: (e: any) => any;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class DeleteButton extends JSXComponent(DeleteButtonProps) {}
