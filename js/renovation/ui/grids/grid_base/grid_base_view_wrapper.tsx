import {
  JSXComponent, Component, Ref, OneWay, ComponentBindings, Effect, RefObject,
} from '@devextreme-generator/declarations';
import $ from '../../../../core/renderer';
import type { GridBaseView } from './common/types';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({ viewRef }: GridBaseViewWrapper) => (
  <div ref={viewRef} />
);
@ComponentBindings()
export class GridBaseViewWrapperProps {
  @OneWay() view!: GridBaseView;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class GridBaseViewWrapper extends JSXComponent<GridBaseViewWrapperProps, 'view'>() {
  @Ref()
  viewRef!: RefObject<HTMLDivElement>;

  @Effect({ run: 'once' })
  renderView(): void {
    // eslint-disable-next-line no-underscore-dangle
    const $element = $(this.viewRef.current!);

    // eslint-disable-next-line no-underscore-dangle
    this.props.view._$element = $element;
    // eslint-disable-next-line no-underscore-dangle
    this.props.view._$parent = ($element as any).parent();
    this.props.view.render();
  }
}
