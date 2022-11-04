import {ItemVM, PageNumberVM, PageSizeVM} from '@devexpress/core/src/components/pager';
import {
  DxPagerPageNumberItemViewComponent, DxPagerPageNumberViewComponent,
  DxPagerPageSizeItemViewComponent,
  DxPagerPageSizeViewComponent
} from '../views/index';

interface ItemAngularVM<Template> extends ItemVM {
  template: Template;
}

interface PageSizeAngularVM extends PageSizeVM {
  items: ItemAngularVM<DxPagerPageSizeItemViewComponent>[];
  template: DxPagerPageSizeViewComponent;
}

interface PageNumberAngularVM extends PageNumberVM {
  items: ItemAngularVM<DxPagerPageNumberItemViewComponent>[];
  template: DxPagerPageNumberViewComponent;
}

export type {
  ItemAngularVM,
  PageSizeAngularVM,
  PageNumberAngularVM,
}
