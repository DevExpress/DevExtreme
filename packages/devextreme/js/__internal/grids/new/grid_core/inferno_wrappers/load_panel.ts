import type { Properties as LoadPanelProperties } from '@js/ui/load_panel';
import dxLoadPanel from '@js/ui/load_panel';

import { InfernoWrapper } from './widget_wrapper';

export type { LoadPanelProperties };

export class LoadPanel extends InfernoWrapper<LoadPanelProperties, dxLoadPanel> {
  protected getComponentFabric(): typeof dxLoadPanel {
    return dxLoadPanel;
  }
}
