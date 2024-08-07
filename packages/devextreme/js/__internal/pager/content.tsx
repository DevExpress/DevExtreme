/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
import type { RefObject } from '@devextreme-generator/declarations';
import type { PagerDisplayMode } from '@js/common/grids';

import { registerKeyboardAction } from '../../ui/shared/accessibility';
import type { EventCallback } from '../core/r1/event_callback';
import type { DisposeEffectReturn } from '../core/r1/utils/effect_return';
import { combineClasses } from '../core/r1/utils/render_utils';
import {
  LIGHT_MODE_CLASS, PAGER_CLASS, PAGER_PAGE_INDEXES_CLASS, PAGER_PAGES_CLASS,
} from './common/consts';
import type { KeyboardActionContextType } from './common/keyboard_action_context';
import { KeyboardActionContext } from './common/keyboard_action_context';
import type { PagerProps } from './common/pager_props';
import { PagerDefaultProps } from './common/pager_props';
import { Widget } from './common/widget';
import { InfoText } from './info';
import { PageSizeSelector } from './page_size/selector';
import { PageIndexSelector } from './pages/page_index_selector';

export interface PagerContentProps extends PagerProps {
  infoTextVisible: boolean;
  isLargeDisplayMode: boolean;
  rootElementRef?: RefObject<HTMLDivElement>;
  pageSizesRef?: RefObject<HTMLDivElement>;
  pagesRef?: RefObject<HTMLElement>;
  infoTextRef?: RefObject<HTMLDivElement>;
}

export const PagerContentDefaultProps: PagerContentProps = {
  ...PagerDefaultProps,
  infoTextVisible: true,
  isLargeDisplayMode: true,
};

export class PagerContent extends InfernoComponent<PagerContentProps> {
  public state: any = {};

  public refs: any = null;

  public widgetElementRef?: RefObject<HTMLDivElement>;

  public widgetRootElementRef?: RefObject<HTMLDivElement>;

  public __getterCache: any = {
    keyboardAction: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.__getterCache = {};
    this.setRootElementRef = this.setRootElementRef.bind(this);
    this.createFakeInstance = this.createFakeInstance.bind(this);
  }

  createEffects(): InfernoEffect[] {
    return [new InfernoEffect(this.setRootElementRef, [])];
  }

  getChildContext(): any {
    return {
      ...this.context,
      [KeyboardActionContext.id]: this.getKeyboardAction() || KeyboardActionContext.defaultValue,
    };
  }

  setRootElementRef(): void {
    const { rootElementRef } = this.props;
    if (rootElementRef && this.widgetRootElementRef) {
      rootElementRef.current = this.widgetRootElementRef.current;
    }
  }

  private createFakeInstance(): {
    option: () => boolean;
    element: () => HTMLElement | null;
    _createActionByOption: () => (e: any) => void;
  } {
    return {
      option: (): boolean => false,
      element: (): HTMLElement | null => this.widgetRootElementRef?.current as HTMLElement,
      // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
      _createActionByOption: () => (e: any) => {
        this.props.onKeyDown?.(e);
      },
    };
  }

  getKeyboardAction(): KeyboardActionContextType {
    return {
      registerKeyboardAction:
        (element: HTMLElement, action: EventCallback): DisposeEffectReturn => {
          const fakePagerInstance = this.createFakeInstance();
          return registerKeyboardAction('pager', fakePagerInstance, element, undefined, action);
        },
    };
  }

  getInfoVisible(): boolean {
    const {
      infoTextVisible,
      showInfo,
    } = this.props;
    return !!showInfo && infoTextVisible;
  }

  getPageIndexSelectorVisible(): boolean {
    return this.props.pageSize !== 0;
  }

  getNormalizedDisplayMode(): PagerDisplayMode {
    const {
      displayMode,
      lightModeEnabled,
    } = this.props;
    if (displayMode === 'adaptive' && lightModeEnabled !== undefined) {
      return lightModeEnabled ? 'compact' : 'full';
    }
    return displayMode ?? 'adaptive';
  }

  getPagesContainerVisible(): boolean {
    return !!this.props.pagesNavigatorVisible && this.props.pageCount > 0;
  }

  getPagesContainerVisibility(): 'hidden' | undefined {
    if (this.props.pagesNavigatorVisible === 'auto' && this.props.pageCount === 1 && this.props.hasKnownLastPage) {
      return 'hidden';
    }
    return undefined;
  }

  getIsLargeDisplayMode(): boolean {
    const displayMode = this.getNormalizedDisplayMode();
    let result = false;
    if (displayMode === 'adaptive') {
      result = this.props.isLargeDisplayMode;
    } else {
      result = displayMode === 'full';
    }
    return result;
  }

  getClasses(): string {
    const classesMap = {
      [`${this.props.className}`]: !!this.props.className,
      [PAGER_CLASS]: true,
      [LIGHT_MODE_CLASS]: !this.getIsLargeDisplayMode(),
    };
    return combineClasses(classesMap);
  }

  getAria(): Record<string, string> {
    return {
      role: 'navigation',
      label: this.props.label ?? '',
    };
  }

  componentWillUpdate(nextProps: PagerContentProps): void {
    super.componentWillUpdate();
    if (this.props.onKeyDown !== nextProps.onKeyDown) {
      this.__getterCache.keyboardAction = undefined;
    }
  }

  render(): JSX.Element {
    const {
      rtlEnabled,
      visible,
      showPageSizes,
      pageSizesRef,
      pageSize,
      pageSizeChange,
      pageSizes,
      infoTextRef,
      infoText,
      pageCount,
      pageIndex,
      totalCount,
      pagesRef,
      hasKnownLastPage,
      maxPagesCount,
      pageIndexChange,
      pagesCountText,
      showNavigationButtons,
    } = this.props;

    return (
      <Widget
        rootElementRef={this.widgetRootElementRef}
        rtlEnabled={rtlEnabled}
        classes={this.getClasses()}
        visible={visible}
        aria={this.getAria()}
      >
        {showPageSizes && (
          <PageSizeSelector
            rootElementRef={pageSizesRef}
            isLargeDisplayMode={this.getIsLargeDisplayMode()}
            pageSize={pageSize}
            pageSizeChange={pageSizeChange}
            pageSizes={pageSizes}
          />
        )}
        {this.getPagesContainerVisible() && (
          <div
            className={PAGER_PAGES_CLASS}
            style={{ visibility: this.getPagesContainerVisibility() }}
          >
            {this.getInfoVisible() && (
              <InfoText
                rootElementRef={infoTextRef}
                infoText={infoText}
                pageCount={pageCount}
                pageIndex={pageIndex}
                totalCount={totalCount}
              />
            )}
            {this.getPageIndexSelectorVisible() && (
              <div
                className={PAGER_PAGE_INDEXES_CLASS}
                ref={pagesRef as any}
              >
                <PageIndexSelector
                  hasKnownLastPage={hasKnownLastPage}
                  isLargeDisplayMode={this.getIsLargeDisplayMode()}
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
          </div>
        )}
      </Widget>
    );
  }
}
PagerContent.defaultProps = PagerContentDefaultProps;
