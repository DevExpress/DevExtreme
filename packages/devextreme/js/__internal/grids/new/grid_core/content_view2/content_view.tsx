import { Scrollable } from '../inferno_wrappers/scrollable';
import { Content } from './content/content';
import type { ErrorRowProperties } from './error_row';
import { ErrorRow } from './error_row';
import type { LoadPanelProperties } from './load_panel';
import { LoadPanel } from './load_panel';
import type { NoDataTextProperties } from './no_data_text';
import { NoDataText } from './no_data_text';

export const CLASSES = {
  content: 'dx-gridcore-content',
};

export interface ContentViewWrapperProps {
  children?: JSX.Element;

  errorRowProps: ErrorRowProperties;
  loadPanelProps: LoadPanelProperties & { visible: boolean };
  noDataTextProps: NoDataTextProperties & { visible: boolean };
}

export function ContentViewWrapper(
  props: ContentViewWrapperProps,
): JSX.Element {
  return (
    <>
      <ErrorRow {...props.errorRowProps} />
      {props.loadPanelProps.visible && <LoadPanel {...props.loadPanelProps} />}
      {props.loadPanelProps.visible && <NoDataText {...props.noDataTextProps} />}
      <Scrollable componentRef={this.scrollableRef}>
        <div className={CLASSES.content} tabIndex={0}>
          {props.children}
        </div>
      </Scrollable>
    </>
  );
}

export interface ContentViewProps
  extends Omit<ContentViewWrapperProps, 'children'> {}

export function ContentView(props: ContentViewProps): JSX.Element {
  return (
    <ContentViewWrapper {...props}>
      <Content />
    </ContentViewWrapper>
  );
}
