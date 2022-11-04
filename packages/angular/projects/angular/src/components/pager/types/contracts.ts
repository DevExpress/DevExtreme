import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  PagerContractConfigs,
  PagerContractModels,
  PagerContractTemplates
} from '@devexpress/core/src/components/pager'
import {AngularContracts, type AngularTemplate} from '../../../internal/index';
import {
  DxPagerPageNumberItemViewComponent,
  DxPagerPageNumberViewComponent, DxPagerPageSizeItemViewComponent,
  DxPagerPageSizeViewComponent, DxPagerViewComponent,
  DxPagerViewContracts
} from '../views/index';

@Component({ template: '' })
export abstract class DxPagerContracts implements AngularContracts<PagerContractModels, PagerContractConfigs, PagerContractTemplates>{
  // inputs.
  @Input() selectedPage?: number;
  @Input() selectedPageSize?: number;
  @Input() pageCount?: number;
  @Input() pageSizes?: number[];
  // customization.
  // @ts-ignore
  @Input() pagerView: AngularTemplate<DxPagerViewContracts>;
  // @ts-ignore
  @Input() pageNumberView: AngularTemplate<DxPagerPageNumberViewComponent>;
  // @ts-ignore
  @Input() pageNumberItemView: AngularTemplate<DxPagerPageNumberItemViewComponent>;
  // @ts-ignore
  @Input() pageNumberFakeItemView: AngularTemplate<DxPagerPageNumberItemViewComponent>;
  // @ts-ignore
  @Input() pageSizeView: AngularTemplate<DxPagerPageSizeViewComponent>;
  // @ts-ignore
  @Input() pageSizeItemView: AngularTemplate<DxPagerPageSizeItemViewComponent>;
  // outputs.
  @Output() selectedPageChange = new EventEmitter<number>();
  @Output() selectedPageSizeChange = new EventEmitter<number>();
}
