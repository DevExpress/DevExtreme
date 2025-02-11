/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { InfernoComponent, InfernoEffect } from '@devextreme/runtime/inferno';
import type { DisplayMode } from '@js/common';
import type { RefObject } from '@ts/core/r1/types';
import { Widget } from '@ts/core/r1/widget';
import { createRef as infernoCreateRef } from 'inferno';

import { registerKeyboardAction } from '../../ui/shared/accessibility';
import type { EventCallback } from '../core/r1/event_callback';
import type { DisposeEffectReturn } from '../core/r1/utils/effect_return';
import { combineClasses } from '../core/r1/utils/render_utils';
import {
  LIGHT_MODE_CLASS,
  PAGER_CLASS,
  PAGINATION_CLASS,
  PAGINATION_PAGE_INDEXES_CLASS,
  PAGINATION_PAGES_CLASS,
} from './common/consts';
import type { KeyboardActionContextType } from './common/keyboard_action_context';
import { KeyboardActionContext } from './common/keyboard_action_context';
import { PaginationConfigProvider } from './common/pagination_config_provider';
import type { PaginationProps } from './common/pagination_props';
import { PaginationDefaultProps } from './common/pagination_props';
import { InfoText } from './info';
import { PageSizeSelector } from './page_size/selector';
import { PageIndexSelector } from './pages/page_index_selector';

export interface PaginationContentProps extends PaginationProps {
  infoTextVisible: boolean;
  isLargeDisplayMode: boolean;
  rootElementRef?: RefObject<HTMLDivElement>;
  allowedPageSizesRef?: RefObject<HTMLDivElement>;
  pagesRef?: RefObject<HTMLElement>;
  infoTextRef?: RefObject<HTMLDivElement>;
}

export const PaginationContentDefaultProps: PaginationContentProps = {
  ...PaginationDefaultProps,
  infoTextVisible: true,
  isLargeDisplayMode: true,
};

export class PaginationContent extends InfernoComponent<PaginationContentProps> {
  public state: any = {};

  public refs: any = null;

  // eslint-disable-next-line max-len
  public widgetElementRef?: RefObject<HTMLDivElement> = infernoCreateRef() as RefObject<HTMLDivElement>;

  // eslint-disable-next-line max-len
  public widgetRootElementRef?: RefObject<HTMLDivElement> = infernoCreateRef() as RefObject<HTMLDivElement>;

  public pagesRef?: RefObject<HTMLDivElement> = infernoCreateRef() as RefObject<HTMLDivElement>;

  public infoTextRef?: RefObject<HTMLDivElement> = infernoCreateRef() as RefObject<HTMLDivElement>;

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
          const fakePaginationInstance = this.createFakeInstance();
          return registerKeyboardAction('pager', fakePaginationInstance, element, undefined, action);
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

  getNormalizedDisplayMode(): DisplayMode {
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
      [PAGER_CLASS]: !!this.props.isGridCompatibilityMode,
      [PAGINATION_CLASS]: !this.props.isGridCompatibilityMode,
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

  componentWillUpdate(nextProps: PaginationContentProps): void {
    super.componentWillUpdate();
    if (this.props.onKeyDown !== nextProps.onKeyDown) {
      this.__getterCache.keyboardAction = undefined;
    }
  }

  render(): JSX.Element {
    const {
      isGridCompatibilityMode,
      rtlEnabled,
      visible,
      showPageSizeSelector,
      allowedPageSizesRef,
      pageSize,
      pageSizeChangedInternal,
      allowedPageSizes,
      infoTextRef,
      infoText,
      pageCount,
      pageIndex,
      itemCount,
      pagesRef,
      hasKnownLastPage,
      maxPagesCount,
      pageIndexChangedInternal,
      pagesCountText,
      showNavigationButtons,
      style,

      width,
      height,
      elementAttr,

      hint,
      disabled,
      tabIndex,
      accessKey,
      activeStateEnabled,
      focusStateEnabled,
      hoverStateEnabled,
    } = this.props;

    const content = (
      <Widget
        rootElementRef={this.widgetRootElementRef}
        rtlEnabled={rtlEnabled}
        classes={this.getClasses()}
        visible={visible}
        aria={this.getAria()}
        style={style as Record<string, string | number> | undefined}
        width={width as string | number | undefined}
        height={height as string | number | undefined}

        hint={hint}
        disabled={disabled}
        tabIndex={tabIndex}
        accessKey={accessKey}
        activeStateEnabled={activeStateEnabled}
        focusStateEnabled={focusStateEnabled}
        hoverStateEnabled={hoverStateEnabled}

        { ...elementAttr as object }
      >
        {showPageSizeSelector && (
          <PageSizeSelector
            rootElementRef={allowedPageSizesRef}
            isLargeDisplayMode={this.getIsLargeDisplayMode()}
            pageSize={pageSize}
            pageSizeChangedInternal={pageSizeChangedInternal}
            allowedPageSizes={allowedPageSizes}
          />
        )}
        {this.getPagesContainerVisible() && (
          <div
            className={PAGINATION_PAGES_CLASS}
            style={{ visibility: this.getPagesContainerVisibility() }}
          >
            {this.getInfoVisible() && (
              <InfoText
                rootElementRef={infoTextRef}
                infoText={infoText}
                pageCount={pageCount}
                pageIndex={pageIndex}
                itemCount={itemCount}
              />
            )}
            {this.getPageIndexSelectorVisible() && (
              <div
                className={PAGINATION_PAGE_INDEXES_CLASS}
                ref={pagesRef as any}
              >
                <PageIndexSelector
                  hasKnownLastPage={hasKnownLastPage}
                  isLargeDisplayMode={this.getIsLargeDisplayMode()}
                  maxPagesCount={maxPagesCount}
                  pageCount={pageCount}
                  pageIndex={pageIndex}
                  pageIndexChangedInternal={pageIndexChangedInternal}
                  pagesCountText={pagesCountText}
                  showNavigationButtons={showNavigationButtons}
                  itemCount={itemCount}
                />
              </div>
            )}
          </div>
        )}
      </Widget>
    );

    return (
      <PaginationConfigProvider isGridCompatibilityMode={isGridCompatibilityMode}>
        {content}
      </PaginationConfigProvider>
    );
  }
}
PaginationContent.defaultProps = PaginationContentDefaultProps;
