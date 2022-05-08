import {
  Component,
  JSXComponent,
  ComponentBindings,
  OneWay,
  Effect,
  InternalState,
  Consumer,
  JSXTemplate,
} from '@devextreme-generator/declarations';
import { PluginsContext, Plugins } from '../../../../utils/plugin/context';
import { Row, RowTemplateProps } from '../types';
import { RowBase, RowClassesGetter } from '../widgets/row_base';
import { MasterDetailTemplate } from './plugins';
import { VisibleColumns } from '../plugins';
import CLASSES from '../classes';

export const viewFunction = (viewModel: MasterDetailRow): JSX.Element => {
  const { masterDetailRowTemplate: MasterDetailRowTemplate, colSpan } = viewModel;
  const {
    row,
    rowIndex,
  } = viewModel.props;
  return (
    <RowBase row={row}>
      <td className="dx-cell-focus-disabled dx-master-detail-cell" colSpan={colSpan}>
        { MasterDetailRowTemplate && <MasterDetailRowTemplate row={row} rowIndex={rowIndex} /> }
      </td>
    </RowBase>
  );
};

@ComponentBindings()
export class MasterDetailRowProps {
  @OneWay()
  row: Row = {
    data: {},
    rowType: 'data',
  };

  @OneWay()
  rowIndex = 0;
}

@Component({
  defaultOptionRules: null,
  view: viewFunction,
})
export class MasterDetailRow extends JSXComponent(MasterDetailRowProps) {
  @Consumer(PluginsContext)
  plugins = new Plugins();

  @InternalState()
  template!: JSXTemplate<RowTemplateProps>;

  @InternalState()
  colSpan = 1;

  get masterDetailRowTemplate(): JSXTemplate<RowTemplateProps> | undefined {
    return this.template;
  }

  @Effect()
  updateColSpan(): () => void {
    return this.plugins.watch(VisibleColumns, (columns) => {
      this.colSpan = columns.length;
    });
  }

  @Effect()
  updateTemplate(): () => void {
    return this.plugins.watch(MasterDetailTemplate, (template) => {
      this.template = template;
    });
  }

  @Effect()
  extendMasterDetailRowClasses(): () => void {
    return this.plugins.extend(
      RowClassesGetter, 1,
      (base) => (row): Record<string, boolean> => {
        if (row.rowType === 'detail') {
          return {
            ...base(row),
            [CLASSES.masterDetailRow]: true,
          };
        }
        return base(row);
      },
    );
  }
}
