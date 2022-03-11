import {
  Component,
  ComponentBindings,
  JSXComponent,
  OneWay,
} from '@devextreme-generator/declarations';

export const viewFunction = (): JSX.Element => (
  <div>123</div>
);

@ComponentBindings()
export class TestComponentProps {
  @OneWay() test = true;
}

@Component({ view: viewFunction })
export class TestComponent extends JSXComponent<TestComponentProps>() {
}
