import {
  Component,
  JSXComponent,
} from '@devextreme-generator/declarations';

import { SchedulerProps } from './props';

// import { combineClasses } from '../../utils/combine_classes';
import { Widget } from '../common/widget';

export const viewFunction = (viewModel: Scheduler): JSX.Element => {
  const { restAttributes } = viewModel;
  return (
    <Widget
      {...restAttributes} // eslint-disable-line react/jsx-props-no-spreading
    />
  );
};

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})

export class Scheduler extends JSXComponent(SchedulerProps) {
  // eslint-disable-next-line class-methods-use-this
  // get cssClasses(): string {
  //   return combineClasses({
  //     'dx-form': true,
  //   });
  // }
}
