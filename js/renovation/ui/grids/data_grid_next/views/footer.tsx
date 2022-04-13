import {
  Component, JSXComponent, ComponentBindings,
} from '@devextreme-generator/declarations';
import { createPlaceholder } from '../../../../utils/plugin/context';
import { Placeholder } from '../../../../utils/plugin/placeholder';

export const FooterPlaceholder = createPlaceholder();

export const viewFunction = (): JSX.Element => (
  <Placeholder type={FooterPlaceholder} />
);

@ComponentBindings()
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class FooterProps {
}

@Component({
  defaultOptionRules: null,
  jQuery: { register: false },
  view: viewFunction,
})
// eslint-disable-next-line @typescript-eslint/no-extraneous-class
export class Footer extends JSXComponent(FooterProps) {
}
