/* eslint-disable max-classes-per-file */
import type { dxElementWrapper } from '@js/core/renderer';
import $ from '@js/core/renderer';
import { computed, effect, type ReadonlySignal } from '@ts/core/state_manager/index';
import { HeaderFilterView as OldHeaderFilterPopup } from '@ts/grids/grid_core/header_filter/m_header_filter_core';
import { View } from '@ts/grids/new/grid_core/core/view';
import { WidgetMock } from '@ts/grids/new/grid_core/widget_mock';
import { Component, createRef } from 'inferno';

import { CLASSES } from '../../const';
import { HeaderFilterViewController } from './view_controller';

export interface OldHeaderFilterPopupInterface {
  render: (dxWrapper: dxElementWrapper) => void;
  dispose: () => void;
}

export interface HeaderFilterPopupComponentProps {
  oldHeaderFilterPopup: OldHeaderFilterPopupInterface;
}

export class HeaderFilterPopupComponent extends Component<HeaderFilterPopupComponentProps> {
  private readonly containerRef = createRef<HTMLDivElement>();

  public render(): JSX.Element {
    return (
      <div className={CLASSES.excludeFlexBox} ref={this.containerRef}></div>
    );
  }

  public componentDidMount(): void {
    this.props.oldHeaderFilterPopup.render($(this.containerRef.current ?? undefined));
  }

  public componentDidUpdate(): void {
    this.props.oldHeaderFilterPopup.render($(this.containerRef.current ?? undefined));
  }

  public componentWillUnmount(): void {
    this.props.oldHeaderFilterPopup.dispose();
  }
}

export class HeaderFilterPopupView extends View<{}> {
  private readonly oldHeaderFilterPopup: OldHeaderFilterPopup;

  protected component = HeaderFilterPopupComponent;

  public static dependencies = [
    WidgetMock,
    HeaderFilterViewController,
  ] as const;

  constructor(
    private readonly widget: WidgetMock,
    private readonly headerFilterViewController: HeaderFilterViewController,
  ) {
    super();
    this.oldHeaderFilterPopup = new OldHeaderFilterPopup(this.widget);
    this.oldHeaderFilterPopup.init();

    effect(() => {
      const popupState = this.headerFilterViewController.popupState.value;
      if (!popupState) {
        return;
      }

      this.oldHeaderFilterPopup.showHeaderFilterMenu($(popupState.element), popupState.options);
    });
  }

  protected getProps(): ReadonlySignal<{}> {
    return computed(() => ({
      oldHeaderFilterPopup: this.oldHeaderFilterPopup,
    }));
  }
}
