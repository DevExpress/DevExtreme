import messageLocalization from '@js/common/core/localization/message';
import { isDefined } from '@js/core/utils/type';
import { hasWindow } from '@js/core/utils/window';
import type { DataController } from '@ts/grids/grid_core/data_controller/data_controller';
import type { DataSourceController } from '@ts/grids/grid_core/data_source/data_source_controller';
import type { KeyboardNavigationController } from '@ts/grids/grid_core/keyboard_navigation/m_keyboard_navigation';
import type { InternalGridOptions, OptionChanged } from '@ts/grids/grid_core/types';
import type { PaginationProps } from '@ts/pagination/common/pagination_props';
import Pagination from '@ts/pagination/wrappers/pagination';

import modules from '../modules/modules';
import type { PageSizes } from './types';

const PAGER_CLASS = 'pager';
export const MAX_PAGES_COUNT = 10;

// TODO getController
export class PagerView extends modules.View {
  private _pager?: Pagination | null;

  private _pageSizes?: PageSizes | null;

  private dataController!: DataController;

  private dataSourceController!: DataSourceController;

  private keyboardNavigationController!: KeyboardNavigationController;

  public init(): void {
    this.dataController = this.getController('data');
    this.dataSourceController = this.getController('dataSource');
    this.keyboardNavigationController = this.getController('keyboardNavigation');

    this.dataController.changed.add((e) => {
      if (e && e.repaintChangesOnly) {
        const pager = this._pager;
        if (pager) {
          pager.option({
            pageIndex: this.getPageIndex(),
            pageSize: this.dataController.pageSize(),
            pageCount: this.dataSourceController.pageCount(),
            itemCount: this.dataSourceController.totalCount(),
            hasKnownLastPage: this.dataSourceController.hasKnownLastPage(),
          });
        } else {
          this.render();
        }
      } else if (!e || (e.changeType !== 'update' && e.changeType !== 'updateSelection' && e.changeType !== 'updateFocusedRow')) {
        this._pager = null;
        this.render();
      }
    });
  }

  public dispose(): void {
    this._pager = null;
  }

  public optionChanged(args: OptionChanged): void {
    const isPager = args.name === 'pager';
    const isPaging = args.name === 'paging';
    const isDataSource = args.name === 'dataSource';
    const isScrolling = args.name === 'scrolling';

    if (isPager || isPaging || isScrolling || isDataSource) {
      args.handled = true;

      if (this.dataController.skipProcessingPagingChange(args.fullName)) {
        return;
      }

      if (isPager || isPaging) {
        this._pageSizes = null;
      }

      if (!isDataSource) {
        this._pager = null;
        this._invalidate();
        if (hasWindow() && isPager && this.component) {
          // @ts-expect-error the resizing controller's publicMethods() add resize()
          this.component.resize();
        }
      }
    }
  }

  protected _renderCore(): void {
    const $element = this.element();

    if (!$element) {
      return;
    }

    $element.addClass(this.addWidgetPrefix(PAGER_CLASS));
    const pagerOptions = this.option('pager') ?? {};
    const options: Partial<PaginationProps> = {
      maxPagesCount: MAX_PAGES_COUNT,
      pageIndex: this.getPageIndex(),
      pageCount: this.dataSourceController.pageCount(),
      pageSize: this.dataController.pageSize(),
      showPageSizeSelector: pagerOptions.showPageSizeSelector,
      showInfo: pagerOptions.showInfo,
      displayMode: pagerOptions.displayMode,
      pagesNavigatorVisible: pagerOptions.visible,
      showNavigationButtons: pagerOptions.showNavigationButtons,
      label: pagerOptions.label,
      // @ts-expect-error the grid's page sizes allow 'auto', Pagination's don't
      allowedPageSizes: this.getPageSizes(),
      itemCount: this.dataSourceController.totalCount(),
      hasKnownLastPage: this.dataSourceController.hasKnownLastPage(),
      rtlEnabled: this.option('rtlEnabled'),
      isGridCompatibilityMode: true,
      _getParentComponentRootNode: () => this.component.element(),
      _skipValidation: true,
      pageIndexChanged: (pageIndex) => {
        if (this.dataController.pageIndex() !== pageIndex - 1) {
          this.dataController.pageIndex(pageIndex - 1);
        }
      },
      pageSizeChanged: (pageSize) => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises -- fire-and-forget
        this.dataController.pageSize(pageSize);
      },
      onKeyDown: (e) => this.keyboardNavigationController?.executeAction('onKeyDown', e),
    };

    if (isDefined(pagerOptions.infoText)) {
      options.infoText = pagerOptions.infoText;
    }

    if (this._pager) {
      this._pager.repaint();
      return;
    }

    if (hasWindow()) {
      this._pager = this._createComponent($element, Pagination, options);
    } else {
      $element
        .addClass('dx-pager')
        .html('<div class="dx-pages"><div class="dx-page"></div></div>');
    }
  }

  private getPageIndex(): number {
    return 1 + (parseInt(String(this.dataController.pageIndex()), 10) || 0);
  }

  private getPageSizes(): PageSizes {
    // state storing calls this before init() if the data loads synchronously
    const dataController = this.getController('data');
    const pagerOptions = this.option('pager');
    const allowedPageSizes = pagerOptions?.allowedPageSizes;
    const pageSize = dataController.pageSize();

    if (!isDefined(this._pageSizes) || !this._pageSizes.includes(pageSize)) {
      this._pageSizes = [];
      if (pagerOptions) {
        if (Array.isArray(allowedPageSizes)) {
          this._pageSizes = allowedPageSizes;
        } else if (allowedPageSizes && pageSize > 1) {
          this._pageSizes = [Math.floor(pageSize / 2), pageSize, pageSize * 2];
        }
      }
    }
    return this._pageSizes;
  }

  public isVisible(): boolean {
    const pagerVisible = this.option('pager')?.visible;

    if (pagerVisible !== 'auto') {
      return !!pagerVisible;
    }

    const scrollingMode = this.option('scrolling')?.mode;

    if (scrollingMode === 'virtual' || scrollingMode === 'infinite') {
      return false;
    }

    return this.dataSourceController.pageCount() > 1
      || (this.dataController.isLoaded() && !this.dataSourceController.hasKnownLastPage());
  }
}

export const pagerModule = {
  defaultOptions(): Pick<InternalGridOptions, 'pager'> {
    return {
      pager: {
        visible: 'auto',
        showPageSizeSelector: false,
        allowedPageSizes: 'auto',
        label: messageLocalization.format('dxPager-ariaLabel'),
      },
    };
  },
  views: {
    pagerView: PagerView,
  },
};
