/* eslint-disable @typescript-eslint/no-non-null-assertion */
import type { ContentViewProps as ContentViewBaseProps } from '@ts/grids/new/grid_core/content_view/content_view';
import { ContentView as ContentViewBase } from '@ts/grids/new/grid_core/content_view/content_view';
import type { InfernoNode } from 'inferno';
import { Component } from 'inferno';

import type { ContentProps } from './content/content';
import { Content } from './content/content';

export interface ContentViewProps extends ContentViewBaseProps {
  contentProps: ContentProps;
}

export class ContentView extends Component<ContentViewProps> {
  render(): InfernoNode {
    return (
      <ContentViewBase {...this.props}>
        <Content {...this.props.contentProps} />
      </ContentViewBase>
    );
  }
}
