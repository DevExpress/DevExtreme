import {
  Component, JSXComponent, OneWay, ComponentBindings,
} from 'devextreme-generator/component_declaration/common';
/* eslint-disable @typescript-eslint/no-unused-vars */
import { h } from 'preact';
import Button, { ButtonProps } from '../../button';
import { TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON } from './consts';

export const viewFunction = (viewModel: DeleteButton) => (
  <Button
    className={`${TOOLTIP_APPOINTMENT_ITEM_DELETE_BUTTON} ${viewModel.props.className}`}
    icon="trash"
    stylingMode="text"
    onClick={viewModel.props.onClick}
      // eslint-disable-next-line react/jsx-props-no-spreading
    {...viewModel.restAttributes}
  />
);

@ComponentBindings()
export class DeleteButtonProps extends ButtonProps {
  @OneWay() className?: string = '';
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export default class DeleteButton extends JSXComponent(DeleteButtonProps) {}
