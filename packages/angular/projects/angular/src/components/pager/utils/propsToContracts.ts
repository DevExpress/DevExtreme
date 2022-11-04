import {DeepPartial} from 'ts-essentials';
import {PageNumberContracts, PagerContracts, PageSizeContracts} from '@devexpress/core/src/components/pager';
import {DxPagerComponent} from '../dx-pager.component';
import {PAGER_DEFAULT_VIEWS} from '../views/index';

const pageNumberPropsToContracts = (
  component: DxPagerComponent
): DeepPartial<PageNumberContracts> => {
  return {
    selectedPage: component.selectedPage,
    pageCount: component.pageCount,
    pageNumberView: component.pageNumberView || PAGER_DEFAULT_VIEWS.pageNumberView,
    pageNumberItemView: component.pageNumberItemView || PAGER_DEFAULT_VIEWS.pageNumberItemView,
    pageNumberFakeItemView: component.pageNumberFakeItemView || PAGER_DEFAULT_VIEWS.pageNumberFakeItemView,
  }
}

const pageSizePropsToContracts = (
  component: DxPagerComponent
): DeepPartial<PageSizeContracts> => {
  return {
    selectedPageSize: component.selectedPageSize,
    pageSizes: component.pageSizes,
    pageSizeView: component.pageSizeView || PAGER_DEFAULT_VIEWS.pageSizeView,
    pageSizeItemView: component.pageSizeItemView || PAGER_DEFAULT_VIEWS.pageSizeItemView,
  }
}

const propsToContracts = (
  component: DxPagerComponent
): DeepPartial<PagerContracts> => {
  return {
    ...pageNumberPropsToContracts(component),
    ...pageSizePropsToContracts(component),
    pagerView: component.pagerView || PAGER_DEFAULT_VIEWS.pagerView,
  }
};

export {propsToContracts};
