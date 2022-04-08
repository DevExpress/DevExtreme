import {
  Component, JSXComponent, ComponentBindings, JSXTemplate, Template,
} from '@devextreme-generator/declarations';
import messageLocalization from '../../../../../localization/message';

import CLASSES from '../classes';

export const viewFunction = (viewModel: NoDataText): JSX.Element => (
  <div className={CLASSES.noData}>
    { viewModel.props.template && <viewModel.props.template /> }
    {!viewModel.props.template && viewModel.text }
  </div>
);

@ComponentBindings()
export class NoDataTextProps {
  @Template()
  template?: JSXTemplate;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class NoDataText extends JSXComponent(NoDataTextProps) {
  // eslint-disable-next-line class-methods-use-this
  get text(): string {
    return messageLocalization.format('dxDataGrid-noDataText');
  }
}
