import { requestAnimationFrame } from 'devextreme/animation/frame';
import { deferUpdate } from 'devextreme/core/utils/common';
import * as React from 'react';

import { TemplatesStore } from './templates-store';

class TemplatesRenderer extends React.PureComponent<{
  templatesStore: TemplatesStore;
}> {
  private updateScheduled = false;

  private mounted = false;

  componentDidMount(): void {
    this.mounted = true;
  }

  componentWillUnmount(): void {
    this.mounted = false;
  }

  public scheduleUpdate(useDeferUpdate: boolean, onRendered?: () => void): void {
    if (this.updateScheduled) {
      return;
    }

    this.updateScheduled = true;

    const updateFunc = useDeferUpdate ? deferUpdate : requestAnimationFrame;
    updateFunc(() => {
      if (this.mounted) {
        this.forceUpdate(() => {
          this.updateScheduled = false;
          onRendered?.();
        });
      }
      this.updateScheduled = false;
    });
  }

  public render(): React.ReactNode {
    const { templatesStore } = this.props;
    return React.createElement(
      React.Fragment,
      {},
      templatesStore.renderWrappers(),
    );
  }
}

export {
  TemplatesRenderer,
};
