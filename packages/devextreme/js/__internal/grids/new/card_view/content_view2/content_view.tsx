import type { ContentViewProps as ContentViewPropsBase } from '../../grid_core/content_view2/content_view';
import { ContentViewWrapper } from '../../grid_core/content_view2/content_view';
import type { ContentProps } from './content/content';
import { Content } from './content/content';

export interface ContentViewProps extends ContentViewPropsBase {
  contentProps: ContentProps;
}

export function ContentView(props: ContentViewProps): JSX.Element {
  return (
    <ContentViewWrapper {...props}>
      <Content {...props.contentProps}/>
    </ContentViewWrapper>
  );
}
