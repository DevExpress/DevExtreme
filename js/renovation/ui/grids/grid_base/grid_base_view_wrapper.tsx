import {
  JSXComponent, Component, Ref, OneWay, ComponentBindings, Effect, RefObject,
} from '@devextreme-generator/declarations';
import $ from '../../../../core/renderer';
import type { GridBaseView } from './common/types';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({ widgetRef }: GridBaseViewWrapper) => (
  <div ref={widgetRef} />
);
@ComponentBindings()
export class GridBaseViewWrapperProps {
  @OneWay() view!: GridBaseView;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class GridBaseViewWrapper extends JSXComponent<GridBaseViewWrapperProps, 'view'>() {
  @Ref()
  widgetRef!: RefObject<HTMLDivElement>;

  @Effect({ run: 'once' })
  renderView(): void {
    // eslint-disable-next-line no-underscore-dangle
    this.props.view._$element = $(this.widgetRef.current!);
    this.props.view.render();
  }
}
