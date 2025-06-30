/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import messageLocalization from '@js/common/core/localization/message';
import $ from '@js/core/renderer';
import { extend } from '@js/core/utils/extend';
import { isDefined } from '@js/core/utils/type';
import LoadPanel from '@js/ui/load_panel';
import gridUtils from '@ts/grids/grid_core/m_utils';

const EXPORT_LOAD_PANEL_CLASS = 'dx-export-loadpanel';
class ExportLoadPanel {
  _$targetElement: any;

  _$container: any;

  _loadPanel: any;

  constructor(component, $targetElement, $container, options) {
    this._$targetElement = $targetElement;
    this._$container = $container;

    this._loadPanel = component._createComponent($('<div>').addClass(EXPORT_LOAD_PANEL_CLASS).appendTo(this._$container), LoadPanel, this.getOptions(options));
  }

  getDefaultOptions() {
    return {
      animation: null,
      shading: false,
      height: 90,
      width: 200,
      container: this._$container,
    };
  }

  getOptions(options) {
    if (isDefined(options.text)) {
      options.message = options.text;
    } else {
      options.message = messageLocalization.format('dxDataGrid-exporting');
    }

    return extend(this.getDefaultOptions(), options);
  }

  show() {
    this._loadPanel.option('position', gridUtils.calculateLoadPanelPosition(this._$targetElement));
    this._loadPanel.show();
  }

  dispose() {
    $(this._loadPanel.element()).remove();
    delete this._loadPanel;
  }
}

export { ExportLoadPanel };
