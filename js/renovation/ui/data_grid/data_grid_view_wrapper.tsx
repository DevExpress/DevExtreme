import {
  JSXComponent, Component, Ref, OneWay, ComponentBindings, Effect,
} from 'devextreme-generator/component_declaration/common';
import $ from '../../../core/renderer';
import type { DataGridView } from './common/types';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({ widgetRef }: DataGridViewWrapper) => (
  <div ref={widgetRef as any} />
);
@ComponentBindings()
export class DataGridViewWrapperProps {
  @OneWay() view!: DataGridView;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class DataGridViewWrapper extends JSXComponent<DataGridViewWrapperProps, 'view'>() {
  @Ref()
  widgetRef!: HTMLDivElement;

  @Effect({ run: 'once' })
  renderView(): void {
    // eslint-disable-next-line no-underscore-dangle
    this.props.view._$element = $(this.widgetRef);
    this.props.view.render();
  }
}
