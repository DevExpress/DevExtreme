// A lot of refs needed any
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Component, ComponentBindings, JSXComponent, OneWay, ForwardRef, Provider, Effect,
} from 'devextreme-generator/component_declaration/common';

import { InfoText } from './info';
import { PageIndexSelector } from './pages/page_index_selector';
import { PageSizeSelector } from './page_size/selector';
import { PAGER_PAGES_CLASS, LIGHT_MODE_CLASS, PAGER_CLASS } from './common/consts';
import PagerProps, { DisplayMode } from './common/pager_props';
import { combineClasses } from '../../utils/combine_classes';
import { Widget } from '../common/widget';
import { DisposeEffectReturn } from '../../utils/effect_return.d';
import { registerKeyboardAction } from '../../../ui/shared/accessibility';
import { EventCallback } from '../common/event_callback.d';
import { KeyboardActionContext, KeyboardActionContextType } from './common/keyboard_action_context';
import noop from '../../utils/noop';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export const viewFunction = ({
  widgetRootElementRef,
  classes,
  pagesContainerVisible,
  pagesContainerVisibility,
  isLargeDisplayMode,
  infoVisible,
  props: {
    pageSizesRef, pagesRef, infoTextRef,
    pageSizeChange, pageIndexChange,
    infoText, maxPagesCount, pageIndex, hasKnownLastPage,
    pageCount, showPageSizes, pageSize, pageSizes,
    pagesCountText, rtlEnabled,
    showNavigationButtons, totalCount,
  },
  restAttributes,
}: PagerContent) => (
  <Widget
    rootElementRef={widgetRootElementRef}
    rtlEnabled={rtlEnabled}
    classes={classes}
  // eslint-disable-next-line react/jsx-props-no-spreading
    {...restAttributes}
  >
    {showPageSizes && (
    <PageSizeSelector
      rootElementRef={pageSizesRef}
      isLargeDisplayMode={isLargeDisplayMode}
      pageSize={pageSize}
      pageSizeChange={pageSizeChange}
      pageSizes={pageSizes}
    />
    )}
    {pagesContainerVisible && (
      <div
        ref={pagesRef as any}
        className={PAGER_PAGES_CLASS}
        style={{ visibility: pagesContainerVisibility }}
      >
        {infoVisible && (
        <InfoText
          rootElementRef={infoTextRef}
          infoText={infoText}
          pageCount={pageCount}
          pageIndex={pageIndex}
          totalCount={totalCount}
        />
        )}
        <PageIndexSelector
          hasKnownLastPage={hasKnownLastPage}
          isLargeDisplayMode={isLargeDisplayMode}
          maxPagesCount={maxPagesCount}
          pageCount={pageCount}
          pageIndex={pageIndex}
          pageIndexChange={pageIndexChange}
          pagesCountText={pagesCountText}
          showNavigationButtons={showNavigationButtons}
          totalCount={totalCount}
        />
      </div>
    )}
  </Widget>
);

/* istanbul ignore next: class has only props default */
@ComponentBindings()
export class PagerContentProps extends PagerProps {
  @OneWay() infoTextVisible = true;

  @OneWay() isLargeDisplayMode = true;

  @ForwardRef() rootElementRef?: HTMLDivElement;

  @ForwardRef() pageSizesRef?: HTMLDivElement;

  @ForwardRef() pagesRef?: HTMLElement;

  @ForwardRef() infoTextRef?: HTMLDivElement;
}

@Component({ defaultOptionRules: null, view: viewFunction })
export class PagerContent extends JSXComponent<PagerContentProps>() {
  @ForwardRef() widgetRootElementRef!: any;

  @Provider(KeyboardActionContext)
  get keyboardAction(): KeyboardActionContextType {
    return {
      registerKeyboardAction:
        (element: HTMLElement, action: EventCallback): DisposeEffectReturn => {
          const fakePagerInstance = {
            option: (): boolean => false,
            element: (): HTMLElement | null => this.widgetRootElementRef,
            // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
            _createActionByOption: () => noop,
          };
          return registerKeyboardAction('pager', fakePagerInstance, element, undefined, action);
        },
    };
  }

  @Effect({ run: 'once' }) setRootElementRef(): void {
    const { rootElementRef } = this.props;
    if (rootElementRef) {
      this.props.rootElementRef = this.widgetRootElementRef;
    }
  }

  get infoVisible(): boolean {
    const { showInfo, infoTextVisible } = this.props;
    return showInfo && infoTextVisible && this.isLargeDisplayMode;
  }

  private get normalizedDisplayMode(): DisplayMode {
    const { lightModeEnabled, displayMode } = this.props;
    if (displayMode === 'adaptive' && lightModeEnabled !== undefined) {
      return lightModeEnabled ? 'compact' : 'full';
    }
    return displayMode;
  }

  get pagesContainerVisible(): boolean {
    return !!this.props.pagesNavigatorVisible && (this.props.pageCount as number) > 0;
  }

  get pagesContainerVisibility(): 'hidden' | undefined {
    if (this.props.pagesNavigatorVisible === 'auto' && this.props.pageCount === 1 && this.props.hasKnownLastPage) {
      return 'hidden';
    }
    return undefined;
  }

  get isLargeDisplayMode(): boolean {
    const displayMode = this.normalizedDisplayMode;
    let result = false;
    if (displayMode === 'adaptive') {
      result = this.props.isLargeDisplayMode;
    } else {
      result = displayMode === 'full';
    }
    return result;
  }

  get classes(): string {
    const classesMap = {
      [`${this.props.className}`]: !!this.props.className,
      [PAGER_CLASS]: true,
      [LIGHT_MODE_CLASS]: !this.isLargeDisplayMode,
    };
    return combineClasses(classesMap);
  }
}
