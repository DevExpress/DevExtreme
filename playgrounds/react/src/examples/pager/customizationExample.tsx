import React from 'react';
import {
  DxPager,
  DxPagerPageSizeItemViewProps,
  DxPagerPageNumberItemViewProps,
  DxPagerPageSizeViewProps,
  DxPagerPageNumberViewProps,
  DxPagerPageNumberItemView,
  DxPagerPageSizeItemView,
  DxPagerViewProps,
  DxPagerPageSizeView,
  DxPagerPageNumberView
} from '@devexpress/react/pager';

import './customizationExample.css';

// --- custom template section ---

const CustomPageSizeItem = ({data: {item, selectPageSize}}: DxPagerPageSizeItemViewProps) => {
  const clickHandler = () => selectPageSize(item.value);
  return (
    <div className={`custom-pager-item ${item.selected ? '--selected' : ''}`}
         key={item.value}
         onClick={clickHandler}>
      {item.label}
    </div>
  );
}

const CustomPageNumberItem = ({data: {item, selectPage}}: DxPagerPageNumberItemViewProps) => {
  const clickHandler = () => selectPage(item.value);
  return (
    <div className={`custom-pager-item ${item.selected ? '--selected' : ''}`}
         key={item.value}
         onClick={clickHandler}>
      {item.label}
    </div>
  );
}

const CustomPageNumberDivider = ({data: {item}}: DxPagerPageNumberItemViewProps) => {
  return (
    <div className="custom-pager-item divider"
         key={item.value}>
      <div className="divider__line">
      </div>
    </div>
  )
}

const CustomPageSize = ({data: {viewModel, selectPageSize}}: DxPagerPageSizeViewProps) => {
  return (
    <div className="custom-pager-sizes">
      {
        viewModel.items.map((item) =>
          <DxPagerPageSizeItemView key={item.value} data={{
            item,
            selectPageSize,
          }}/>
        )
      }
    </div>
  )
}

const CustomPageNumber = ({data: {viewModel, selectPage}}: DxPagerPageNumberViewProps) => {
  return (
    <div className="custom-pager-numbers">
      <div className="custom-pager-numbers__content">
        {
          viewModel.items.map((item) =>
            <DxPagerPageNumberItemView key={item.value} data={{
              item,
              selectPage,
            }}/>
          )
        }
      </div>
    </div>
  )
}
const RootViewCustomPageNumber = ({data: {viewModel, selectPage}}: DxPagerPageNumberViewProps) => {
  return (
    <div className="custom-pager-numbers">
      <div className="custom-pager-numbers__content">
        <DxPagerPageNumberView data={{ viewModel, selectPage }}></DxPagerPageNumberView>
      </div>
    </div>
  )
}

const CustomPager = ({
                       data: {
                         pageSizeViewModel,
                         pageNumberViewModel,
                         selectedPageChange,
                         selectedPageSizeChange,
                       }
                     }: DxPagerViewProps) => {
  const PageNumberComponent = pageNumberViewModel.template;
  return (
    <div className="custom-pager">
      <div className="custom-pager__item">
        <PageNumberComponent data={{viewModel: pageNumberViewModel, selectPage: selectedPageChange}}/>
      </div>
      <div className="custom-pager__item">
        <DxPagerPageSizeView data={{viewModel: pageSizeViewModel, selectPageSize: selectedPageSizeChange}}/>
      </div>
    </div>
  )
}

// -- example component ---

function CustomizationExample() {
  return (
    <React.Fragment>
      <div className="example">
        <div className="example__title">
          Customization items example
        </div>
        <div className="example__control">
          <DxPager defaultSelectedPage={1}
                   defaultSelectedPageSize={20}
                   pageCount={20}
                   pageSizes={[10, 20, 30]}
                   pageNumberItemView={CustomPageNumberItem}
                   pageNumberFakeItemView={CustomPageNumberDivider}
                   pageSizeItemView={CustomPageSizeItem}
          />
        </div>
      </div>

      <div className="example">
        <div className="example__title">
          Customization reuse default templates example
        </div>
        <div className="example__control">
          <DxPager defaultSelectedPage={1}
                   defaultSelectedPageSize={20}
                   pageCount={20}
                   pageSizes={[10, 20, 30]}
                   pageNumberView={CustomPageNumber}
                   pageSizeView={CustomPageSize}
          />
        </div>
      </div>

      <div className="example">
        <div className="example__title">
          Customization main template example
        </div>
        <div className="example__control">
          <DxPager defaultSelectedPage={1}
                   defaultSelectedPageSize={20}
                   pageCount={20}
                   pageSizes={[10, 20, 30]}
                   pagerView={CustomPager}
                   pageNumberView={RootViewCustomPageNumber}
                   pageNumberItemView={CustomPageNumberItem}
                   pageNumberFakeItemView={CustomPageNumberDivider}
          />
        </div>
      </div>
    </React.Fragment>
  );
}

export {CustomizationExample};
