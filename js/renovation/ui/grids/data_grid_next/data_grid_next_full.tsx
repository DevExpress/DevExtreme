/* eslint-disable max-classes-per-file */
import {
  Component, JSXComponent, ComponentBindings, Nested, Ref, RefObject, Method,
} from '@devextreme-generator/declarations';
import { DataGridNext as DataGridNextBase, DataGridNextProps as DataGridNextPropsBase } from './data_grid_next';
import { DataGridNextPaging, DataGridNextPagingProps } from './paging/paging';
import { DataGridNextPager, DataGridNextPagerProps } from './pager/pager';
import { DataGridNextSelection, DataGridNextSelectionProps } from './selection/selection';
import { DataGridNextMasterDetail, DataGridNextMasterDetailProps } from './master_detail/master_detail';

export const viewFunction = (viewModel: DataGridNext): JSX.Element => (
  <DataGridNextBase
    ref={viewModel.dataGrid}
    dataSource={viewModel.props.dataSource}
    cacheEnabled={viewModel.props.cacheEnabled}
    remoteOperations={viewModel.props.remoteOperations}
    dataState={viewModel.props.dataState}
    keyExpr={viewModel.props.keyExpr}
    columns={viewModel.props.columns}
    showBorders={viewModel.props.showBorders}
    noDataTemplate={viewModel.props.noDataTemplate}
    onDataErrorOccurred={viewModel.props.onDataErrorOccurred}
    activeStateEnabled={viewModel.props.activeStateEnabled}
    className={viewModel.props.className}
    disabled={viewModel.props.disabled}
    focusStateEnabled={viewModel.props.focusStateEnabled}
    height={viewModel.props.height}
    hint={viewModel.props.hint}
    hoverStateEnabled={viewModel.props.hoverStateEnabled}
    rtlEnabled={viewModel.props.rtlEnabled}
    tabIndex={viewModel.props.tabIndex}
    visible={viewModel.props.visible}
    width={viewModel.props.width}
    {...viewModel.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
  >
    <DataGridNextPaging
      enabled={viewModel.props.paging?.enabled}
      pageIndex={viewModel.props.paging?.pageIndex}
      pageSize={viewModel.props.paging?.pageSize}
    />
    <DataGridNextPager
      visible={viewModel.props.pager?.visible}
      showInfo={viewModel.props.pager?.showInfo}
      showNavigationButtons={viewModel.props.pager?.showNavigationButtons}
      showPageSizeSelector={viewModel.props.pager?.showPageSizeSelector}
      allowedPageSizes={viewModel.props.pager?.allowedPageSizes}
      displayMode={viewModel.props.pager?.displayMode}
      infoText={viewModel.props.pager?.infoText}
    />
    <DataGridNextSelection
      mode={viewModel.selectionMode}
      selectedRowKeys={viewModel.props.selection?.selectedRowKeys}
      allowSelectAll={viewModel.props.selection?.allowSelectAll}
      selectAllMode={viewModel.props.selection?.selectAllMode}
    />
    <DataGridNextMasterDetail
      enabled={viewModel.masterDetailEnabled}
      expandedRowKeys={viewModel.props.masterDetail?.expandedRowKeys}
      template={viewModel.props.masterDetail?.template}
    />
  </DataGridNextBase>
);

@ComponentBindings()
export class DataGridNextProps extends DataGridNextPropsBase {
  @Nested()
  paging?: DataGridNextPagingProps;

  @Nested()
  pager?: DataGridNextPagerProps;

  @Nested()
  selection?: DataGridNextSelectionProps;

  @Nested()
  masterDetail?: DataGridNextMasterDetailProps;
}

@Component({
  // defaultOptionRules: null,
  jQuery: { register: true },
  view: viewFunction,
})
export class DataGridNext extends JSXComponent(DataGridNextProps) {
  @Ref() dataGrid!: RefObject<DataGridNextBase>;

  get masterDetailEnabled(): boolean {
    return this.props.masterDetail?.enabled ?? false;
  }

  get selectionMode(): 'multiple' | 'single' | 'none' {
    return this.props.selection?.mode ?? 'none';
  }

  @Method()
  refresh(): void {
    return this.dataGrid.current!.refresh();
  }
}
