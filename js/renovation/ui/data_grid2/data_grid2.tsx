import {
  Component, JSXComponent, ComponentBindings, OneWay,
} from 'devextreme-generator/component_declaration/common';

import { Widget } from '../common/widget';
import BaseWidgetProps from '../../utils/base_props';

export const viewFunction = (viewModel: DataGrid2): JSX.Element => (
  <Widget // eslint-disable-line jsx-a11y/no-access-key
    accessKey={viewModel.props.accessKey}
    activeStateEnabled={viewModel.props.activeStateEnabled}
    aria={viewModel.aria}
    classes={viewModel.cssClasses}
    disabled={viewModel.props.disabled}
    focusStateEnabled={viewModel.props.focusStateEnabled}
    height={viewModel.props.height}
    hint={viewModel.props.hint}
    hoverStateEnabled={viewModel.props.hoverStateEnabled}
    onContentReady={viewModel.props.onContentReady}
    rtlEnabled={viewModel.props.rtlEnabled}
    tabIndex={viewModel.props.tabIndex}
    visible={viewModel.props.visible}
    width={viewModel.props.width}
    {...viewModel.restAttributes} // eslint-disable-line react/jsx-props-no-spreading
  >
    <div className="dx-datagrid dx-gridbase-container" role="grid" aria-label="Data grid">
      <div className="dx-datagrid-headers dx-datagrid-nowrap" role="presentation">
        <div className="dx-datagrid-content dx-datagrid-scroll-container" role="presentation">
          <table className="dx-datagrid-table dx-datagrid-table-fixed" role="presentation">
            <tbody role="presentation">
              <tr className="dx-row dx-column-lines dx-header-row" role="row">
                {viewModel.props.columns.map((dataField, index) => (
                  <td
                    aria-selected="false"
                    role="columnheader" // eslint-disable-line jsx-a11y/no-noninteractive-element-to-interactive-role
                    aria-colindex={index + 1}
                    id={`dx-col-${index + 1}`}
                    aria-label={`Column ${dataField}`}
                    className="dx-datagrid-action dx-cell-focus-disabled"
                    aria-sort="none"
                    tabIndex={0}
                  >
                    <div className="dx-datagrid-text-content dx-text-content-alignment-left" role="presentation">
                      {dataField}
                    </div>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <div className="dx-datagrid-rowsview dx-datagrid-nowrap" role="presentation">
        <div className="dx-datagrid-content">
          <table className="dx-datagrid-table dx-datagrid-table-fixed" role="presentation">
            <tbody role="presentation">
              {viewModel.props.dataSource.map((item, rowIndex) => (
                <tr
                  className="dx-row dx-data-row dx-column-lines"
                  role="row"
                  aria-selected="false"
                  aria-rowindex={rowIndex + 1}
                >
                  {viewModel.props.columns.map((dataField, index) => (
                    <td
                      aria-describedby={`dx-col-${index + 1}`}
                      aria-selected="false"
                      role="gridcell"
                      aria-colindex={index + 1}
                    >
                      {item[dataField]}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Widget>
);

@ComponentBindings()
export class DataGrid2Props extends BaseWidgetProps {
  @OneWay()
  dataSource: object[] = [];

  @OneWay()
  columns: string[] = [];
}

@Component({
  defaultOptionRules: null,
  jQuery: { register: false },
  view: viewFunction,
})
export class DataGrid2 extends JSXComponent(DataGrid2Props) {
  readonly aria = {
    role: 'presentation',
  };

  readonly cssClasses = '';
}
