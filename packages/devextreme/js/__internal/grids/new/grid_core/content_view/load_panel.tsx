import type { PositionConfig } from '@js/common/core/animation';
import { getWindow } from '@js/core/utils/window';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';

import { CommonPropsContext } from '../core/common_props_context';
import type { LoadPanelProperties } from '../inferno_wrappers/load_panel';
import { LoadPanel as LoadPanelBase } from '../inferno_wrappers/load_panel';

export { LoadPanelProperties };

export class LoadPanel extends BaseInfernoComponent<LoadPanelProperties> {
  private calculatePosition(rootElement: HTMLElement): PositionConfig {
    const window = getWindow();

    if (rootElement.offsetHeight > window.innerHeight) {
      return {
        of: window,
        boundary: rootElement,
        collision: 'fit',
      };
    }
    return { of: rootElement };
  }

  public render(): JSX.Element {
    const { rootElementRef } = this.context[CommonPropsContext.id];

    const loadPanelProperties: LoadPanelProperties = {
      container: rootElementRef.current,
      position: this.calculatePosition(rootElementRef.current),
      ...this.props,
    };

    return <LoadPanelBase {...loadPanelProperties} />;
  }
}
