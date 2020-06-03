import {
  Component, JSXComponent,
} from 'devextreme-generator/component_declaration/common';
import Button, { ButtonProps } from '../../button';
import {
  TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON,
} from './consts';

export const viewFunction = (viewModel: DeleteButton) => (
  <Button
    className={TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON}
    icon="trash"
    stylingMode="text"
    onClick={viewModel.props.onClick}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  view: viewFunction,
  jQuery: {
    register: true,
  },
})
export default class DeleteButton extends JSXComponent<ButtonProps> {}
