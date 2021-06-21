import {
  JSXComponent, Component, Ref, OneWay, ComponentBindings, Effect, RefObject, Event,
} from '@devextreme-generator/declarations';
import $ from '../../../../core/renderer';
import type { GridBaseView } from './common/types';

export const viewFunction = ({ viewRef }: GridBaseViewWrapper): JSX.Element => (
  <div ref={viewRef} />
);
@ComponentBindings()
export class GridBaseViewWrapperProps {
  @OneWay() view!: GridBaseView;

  @Event() onRendered?: () => void;
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
    this.props.onRendered?.();
  }
}
