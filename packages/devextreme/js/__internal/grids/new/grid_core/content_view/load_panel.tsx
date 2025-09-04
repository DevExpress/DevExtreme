import { getWindow } from '@js/core/utils/window';
import { BaseInfernoComponent } from '@ts/core/r1/runtime/inferno/index';

import { CommonPropsContext } from '../core/common_props_context';
import type { LoadPanelProperties } from '../inferno_wrappers/load_panel';
import { LoadPanel as LoadPanelBase } from '../inferno_wrappers/load_panel';

export { LoadPanelProperties };

export class LoadPanel extends BaseInfernoComponent<LoadPanelProperties> {
  public render(): JSX.Element {
    const { rootElementRef } = this.context[CommonPropsContext.id];
    const loadPanelProperties: LoadPanelProperties = {
      container: rootElementRef.current,
      position: {
        of: getWindow(),
        boundary: rootElementRef.current,
        collision: 'fit',
      },
      ...this.props,
    };

    return <LoadPanelBase {...loadPanelProperties} />;
  }
}
