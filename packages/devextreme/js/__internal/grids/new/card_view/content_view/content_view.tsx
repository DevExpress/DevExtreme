import type { DataRow } from '@ts/grids/new/grid_core/columns_controller/types';
import { LoadPanel, type LoadPanelProperties } from '@ts/grids/new/grid_core/inferno_wrappers/load_panel';
import { Scrollable } from '@ts/grids/new/grid_core/inferno_wrappers/scrollable';

import { Content } from './content/content';
import type { ErrorRowProperties } from './error_row';
import { ErrorRow } from './error_row';
import type { NoDataTextProperties } from './no_data_text';
import { NoDataText } from './no_data_text';

export const CLASSES = {
  content: 'dx-gridcore-content',
};

export interface ContentViewProps {
  errorRowProps: ErrorRowProperties;
  loadPanelProps: LoadPanelProperties & { visible: boolean };
  noDataTextProps: NoDataTextProperties & { visible: boolean };

  items: DataRow[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fieldTemplate?: any;
}

export function ContentView(props: ContentViewProps): JSX.Element {
  return (
    <>
      <ErrorRow {...props.errorRowProps} />
      {props.loadPanelProps.visible && <LoadPanel {...props.loadPanelProps} />}
      {props.noDataTextProps.visible && <NoDataText {...props.noDataTextProps} />}

      <Scrollable componentRef={this.scrollableRef}>
        <div className={CLASSES.content} tabIndex={0}>
          <Content
            items={props.items}
            fieldTemplate={props.fieldTemplate}
          />
        </div>
      </Scrollable>
    </>
  );
}
