/* eslint-disable max-classes-per-file */

import {
  Component, JSXComponent,
} from '@devextreme-generator/declarations';
/* eslint-disable import/named */
import LegacyForm from '../../../../ui/form';

import { DomComponentWrapper } from '../../common/dom_component_wrapper';
import { FormProps } from './form_props';

export const viewFunction = ({
  componentProps,
  restAttributes,
}: Form): JSX.Element => (
  <DomComponentWrapper
    componentType={LegacyForm}
    componentProps={componentProps}
    templateNames={[]}
   // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  />
);

@Component({
  defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})

export class Form extends JSXComponent<FormProps>() {
  /* istanbul ignore next: WA for Angular */
  get componentProps(): FormProps {
    return this.props;
  }
}
